import { NextResponse } from 'next/server';
import type { Gender, ApiResponse } from '../../../types';
import { commonSurnames } from '../../surnames/surnames.config';

// 从环境变量获取缓存配置
const MAX_CACHE_SIZE = parseInt(process.env.NAMES_CACHE_SIZE || '50', 10);
const CACHE_CLEAR_INTERVAL = parseInt(process.env.NAMES_CACHE_CLEAR_INTERVAL || '900000', 10); // 默认15分钟

// 简单的内存缓存，用于存储最近生成的名字
const recentlyGeneratedNames = new Set<string>();

// 添加缓存最后清除时间
let lastCacheClearTime = Date.now();

// 获取随机姓氏的函数
const getRandomSurname = () => {
  const randomIndex = Math.floor(Math.random() * commonSurnames.length);
  return commonSurnames[randomIndex].surname;
};

// 检查并清除缓存的函数
const checkAndClearCache = () => {
  const now = Date.now();
  if (now - lastCacheClearTime > CACHE_CLEAR_INTERVAL) {
    console.log(`清除名字缓存，已过${CACHE_CLEAR_INTERVAL / 60000}分钟`);
    recentlyGeneratedNames.clear();
    lastCacheClearTime = now;
    return true;
  }
  return false;
};

// 检查姓氏是否为复姓的函数
const isCompoundSurname = (surname: string) => {
  return surname.length > 1;
};

export async function POST(request: Request) {
  try {
    // 验证环境变量
    if (!process.env.API_URL || !process.env.API_KEY) {
      throw new Error('Missing API configuration');
    }

    // 验证请求数据
    const body = await request.json();
    if (!body.gender) {
      return NextResponse.json(
        { error: 'Gender is required' },
        { status: 400 }
      );
    }

    // 解构所有可能的参数
    const {
      gender,
      englishName = '',
      surname = '',
      keywords = '',
      includeSurname = true  // 新增参数，控制是否包含姓氏
    } = body;

    // 修改这里的逻辑，确保用户提供的姓氏被正确使用
    const finalSurname = includeSurname
      ? (surname && surname.trim() !== '' ? surname.trim() : getRandomSurname())
      : '';

    console.log('使用的姓氏:', finalSurname); // 添加日志，便于调试
    // 根据提供的参数构建提示词
    const prompt = buildPrompt(gender, finalSurname, englishName, keywords, includeSurname);

    console.log(prompt);
    // 添加请求超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 30秒超时

    const response = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-v3-241226",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9, // 提高 temperature 值
        max_tokens: 150
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // 验证API响应格式
    if (!result.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }
    try {
      let rawContent = result.choices[0].message.content;

      // 提取所有有效的JSON对象
      const extractValidObjects = (content: string) => {
        const objects: any[] = [];
        const regex = /\{(?:[^{}]|(?:\{[^{}]*\}))*\}/g;
        const matches = content.match(regex);

        if (matches) {
          matches.forEach(match => {
            try {
              const obj = JSON.parse(match);
              if (obj.pinyin && obj.characters && obj.meaning) {
                objects.push(obj);
              }
            } catch (e) {
              // 忽略无效的JSON对象
            }
          });
        }
        return objects;
      };
      let nameData = extractValidObjects(rawContent);

      // 处理名字数据，根据是否包含姓氏进行调整
      nameData = nameData.map(name => {
        // 如果不包含姓氏，确保characters和pinyin字段只包含名字部分
        if (!body.includeSurname) {
          // 确保返回的数据格式正确
          return {
            ...name,
            // 可能需要调整字段，确保不包含姓氏
            characters: name.characters,
            pinyin: name.pinyin
          };
        }
        return name;
      });

      // 记录原始名字数据，以防过滤后没有剩余名字
      const originalNameData = [...nameData];

      // 过滤掉缓存中已存在的名字
      nameData = nameData.filter(name => !recentlyGeneratedNames.has(name.characters));

      // 如果过滤后没有名字了，则使用原始名字数据
      if (nameData.length === 0 && originalNameData.length > 0) {
        console.log('所有生成的名字都在缓存中，使用原始名字数据');
        nameData = originalNameData;
      }

      // 只保留前3个有效的名字
      nameData = nameData.slice(0, 3);

      // 如果没有足够的有效名字，返回错误
      if (nameData.length === 0) {
        throw new Error('No valid name data found');
      }

      // 将新生成的名字添加到缓存中
      nameData.forEach(name => {
        recentlyGeneratedNames.add(name.characters);
        // 如果缓存太大，删除最早添加的项
        if (recentlyGeneratedNames.size > MAX_CACHE_SIZE) {
          const firstItem = recentlyGeneratedNames.values().next().value;
          recentlyGeneratedNames.delete(firstItem);
        }
      });

      // 返回成功结果，即使不满3个名字也返回
      return NextResponse.json(nameData);
    } catch (parseError) {
      console.error('Error parsing name data:', parseError);
      console.error('Raw content:', result.choices[0].message.content);
      throw new Error('Failed to parse generated name data');
    }
    function buildPrompt(gender: string, surname: string, englishName: string, keywords: string, includeSurname: boolean): string {
      // 判断姓氏是否为复姓
      const isCompound = surname.length > 1;

      // 基础提示词部分
      let basePrompt = `Generate three unique and friendly Chinese names suitable for foreigners with the following requirements:
      - Gender: ${gender}`;

      // 根据是否包含姓氏调整提示词
      if (includeSurname && surname) {
        basePrompt += `
  - Surnames: ${surname}
  - Include: surname and given name
  - Important: All generated names MUST use the exact surname "${surname}" as provided`;

        // 添加对复姓的特殊说明
        if (isCompound) {
          basePrompt += `
  - Note: "${surname}" is a compound surname (复姓) that should be treated as a single surname unit, not as separate characters`;
        }
      } else if (includeSurname) {
        basePrompt += `
  - Surnames: ${surname}
  - Include: surname and given name`;
      } else {
        basePrompt += `
  - Generate given names only without surnames
  - Each name should be complete and standalone without requiring a surname`;
      }

      // 添加英文名相关提示（如果提供）
      if (englishName) {
        basePrompt += `
  - English name to reference: ${englishName}
  - Try to create a Chinese name that:
    * Has similar sounds to parts of the English name when possible
    * Captures the essence or meaning of the English name if applicable
    * Maintains cultural appropriateness while honoring the connection to the English name`;
      }

      // 添加关键词相关提示（如果提供）
      if (keywords) {
        basePrompt += `
  - Keywords to incorporate: ${keywords}
  - The generated names should:
    * Reflect the meaning or theme of these keywords
    * Use characters that relate to these concepts
    * Balance the keyword meanings with overall name harmony`;
      }

      // 如果没有提供额外参数，使用更简单友好的名字生成指南
      if (!englishName && !keywords) {
        basePrompt += `
  - Key requirements for foreigner-friendly Chinese names:
    * Use simple, common characters that are easy to write and remember
    * Ensure characters have positive meanings that are easily explained
    * Choose characters with straightforward pronunciations (avoid difficult tones or sounds)
    * Limit given names to one or two characters maximum`;
      }

      // 如果有缓存的名字，添加排除提示
      if (recentlyGeneratedNames.size > 0) {
        const recentNames = Array.from(recentlyGeneratedNames).slice(0, 10).join(', '); // 只取最近10个名字
        basePrompt += `
  - Avoid generating these recently used names: ${recentNames}`;
      }

      // 添加随机种子以增加多样性
      const randomSeed = Math.floor(Math.random() * 10000);
      basePrompt += `
  - Use this random seed for inspiration: ${randomSeed}`;
      basePrompt += `
  - Cultural inspirations (choose different ones for each name):
    * Modern pop culture and contemporary China
    * Nature elements (simple concepts like sun, moon, water, etc.)
    * Common positive qualities (kindness, joy, peace, etc.)
    * International/cross-cultural themes
  - Name variety:`;
      if (isCompound && includeSurname) {
        basePrompt += `
      * For this compound surname "${surname}": You MUST balance given names equally
      * IMPORTANT: Generate exactly one name with a single-character given name and two names with two-character given names
      * Or generate exactly two names with single-character given names and one name with a two-character given name`;
      } else if (includeSurname) {
        basePrompt += `
      * For this single-character surname "${surname}": You MUST balance given names equally
      * IMPORTANT: Generate exactly one name with a single-character given name and two names with two-character given names
      * Or generate exactly two names with single-character given names and one name with a two-character given name`;
      } else {
        basePrompt += `
      * Given names MUST be balanced equally between one and two characters
      * IMPORTANT: Generate exactly one name with a single character and two names with two characters
      * Or generate exactly two names with single characters and one name with two characters`;
      }


      basePrompt += `
    * Include names with different tone patterns
    * Ensure each name has a distinct meaning and sound
  - Format needed for each name:
    1. Pinyin (with tones)
    2. Chinese characters
    3. Simple meaning explanation (2-3 sentences maximum)`;

      // 添加到basePrompt的结尾，在JSON格式之前
      basePrompt += `
CRITICAL REQUIREMENT: The final list MUST contain a mix of both single-character and two-character given names. Do not generate all single-character or all two-character given names.
`;
      basePrompt += `
  - Return the following in JSON format without adding any additional content:
  [
    {
      "pinyin": "surname givenname",
      "characters": "姓名",
      "meaning": "meaning of given name"
    },
    {
      "pinyin": "surname givenname",
      "characters": "姓名",
      "meaning": "meaning of given name"
    },
    {
      "pinyin": "surname givenname",
      "characters": "姓名",
      "meaning": "meaning of given name"
    }
  ]
  Important: Generate names that would be different each time this prompt is used. Avoid common or stereotypical name patterns.`;
      return basePrompt;
    }
  } catch (error: any) {
    console.error('Error generating names:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate names' },
      { status: 500 }
    );
  }
}