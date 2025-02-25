import { NextResponse } from 'next/server';
import type { Gender, ApiResponse } from '../../../types';




// 添加常见百家姓数组
const commonSurnames = [
  '李', '王', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴',
  '徐', '孙', '朱', '马', '胡', '郭', '林', '何', '高', '梁',
  '郑', '罗', '宋', '谢', '唐', '韩', '曹', '许', '邓', '萧',
  '冯', '曾', '程', '蔡', '彭', '潘', '袁', '于', '董', '余',
  '苏', '叶', '吕', '魏', '蒋', '田', '杜', '丁', '沈', '姜',
  '范', '江', '傅', '钟', '卢', '汪', '戴', '崔', '任', '陆',
  '廖', '姚', '方', '金', '邱', '夏', '谭', '韦', '贾', '邹',
  '石', '熊', '孟', '秦', '阎', '薛', '侯', '雷', '白', '龙',
  '段', '郝', '孔', '邵', '史', '毛', '常', '万', '顾', '赖',
  '武', '康', '贺', '严', '尹', '钱', '施', '牛', '洪', '龚'
];

// 获取随机姓氏的函数
const getRandomSurname = () => {
  const randomIndex = Math.floor(Math.random() * commonSurnames.length);
  return commonSurnames[randomIndex];
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


    const { gender, surname = getRandomSurname(), language = 'en' } = body;

    const prompt = `Generate three unique and culturally appropriate Chinese names with the following requirements:
- Gender: ${gender}
- Surnames: ${surname}
- Include: surname and given name
- Cultural backgrounds (randomly choose different ones for each name):
  * Classical poetry and literature
  * Modern art and culture
  * Nature and seasons
  * Philosophy and wisdom
  * Science and innovation
- Name characteristics (ensure variety):
  * Use different number of characters in given names (one or two characters)
  * Mix traditional and contemporary elements
  * Incorporate different themes (e.g., strength, elegance, wisdom, creativity)
  * Use varied tone combinations
- Format needed for each name:
  1. Pinyin (with tones)
  2. Chinese characters
  3. Meaning of the given name in multiple languages:
     * Chinese (zh): detailed meaning in Chinese
     * English (en): detailed meaning in English
     * Filipino (fil): detailed meaning in Filipino
     * Hindi (hi): detailed meaning in Hindi
- Additional requirements:
  * Each name must be completely different in style and theme
  * Avoid common character combinations
  * Consider multiple layers of meaning
  * Use characters that are both meaningful and uncommon
  * Ensure names are easy to pronounce while being distinctive
- Return the following in JSON format without adding any additional content:
[
  {
    "pinyin": "surname givenname",
    "characters": "姓名",
    "meaning": {
      "zh": "中文含义解释",
      "en": "English meaning explanation",
      "fil": "Kahulugan sa Filipino",
      "hi": "हिंदी में अर्थ"
    }
  },
  {
    "pinyin": "surname givenname",
    "characters": "姓名",
    "meaning": {
      "zh": "中文含义解释",
      "en": "English meaning explanation",
      "fil": "Kahulugan sa Filipino",
      "hi": "हिंदी में अर्थ"
    }
  }
]`;

    // 添加请求超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

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
        temperature: 0.7, // 提高 temperature 值
        max_tokens: 1000
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
      // console.log('123: ',result.choices[0].message.content);

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

      // console.log(nameData);

      // // 清理和解析 JSON
      // const parseNameData = (content: string) => {
      //   try {
      //     // 尝试寻找 JSON 数组的开始和结束
      //     const startIdx = content.indexOf('[');
      //     const endIdx = content.lastIndexOf(']') + 1;

      //     if (startIdx === -1 || endIdx === -1) {
      //       throw new Error('Invalid JSON format');
      //     }

      //     // 提取 JSON 数组字符串
      //     const jsonStr = content.substring(startIdx, endIdx);

      //     // 解析 JSON 数组
      //     const nameData = JSON.parse(jsonStr);

      //     // 验证数据结构
      //     if (!Array.isArray(nameData)) {
      //       throw new Error('Not an array');
      //     }

      //     // 验证每个对象的结构
      //     return nameData.filter((item: any) =>
      //       item.pinyin &&
      //       item.characters &&
      //       item.meaning &&
      //       typeof item.meaning === 'object' &&
      //       item.meaning.zh &&
      //       item.meaning.en &&
      //       item.meaning.fil &&
      //       item.meaning.hi
      //     );
      //   } catch (e) {
      //     console.error('JSON parsing error:', e);
      //     return [];
      //   }
      // };

      // let nameData = parseNameData(rawContent);


      // 只保留前3个有效的名字
      nameData = nameData.slice(0, 3);

      // 如果没有足够的有效名字，返回错误
      if (nameData.length === 0) {
        throw new Error('No valid name data found');
      }


      // 根据用户选择的语言返回相应的含义解释
      const processedData = nameData.map((name: any) => ({
        pinyin: name.pinyin,
        characters: name.characters,
        meaning: name.meaning[language] || name.meaning.en // 如果没有对应语言的翻译，则使用英文
      }));

      // 返回成功结果，即使不满3个名字也返回
      return NextResponse.json(processedData);

    } catch (parseError) {
      console.error('Error parsing name data:', parseError);
      console.error('Raw content:', result.choices[0].message.content);
      throw new Error('Failed to parse generated name data');
    }

  } catch (error) {
    console.error('Error generating name:', error);

    // 根据错误类型返回不同的状态码
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 408 }
      );
    }

    if (error.message === 'Missing API configuration') {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (error.message === 'No valid name data found') {
      return NextResponse.json(
        { error: 'Failed to generate valid names' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate name' },
      { status: 500 }
    );
  }
}