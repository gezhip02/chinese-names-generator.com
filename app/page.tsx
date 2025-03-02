import NameGenerator from './NameGenerator';
import PageLayout from './components/Layout/PageLayout';

export default function Home() {
  return (
    <PageLayout showBreadcrumb={false}>
      <NameGenerator />
    </PageLayout>
  );
}