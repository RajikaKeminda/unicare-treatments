import InternalLayout from "./layout";

export default function Home() {
  return <div>Home</div>;
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <InternalLayout>{page}</InternalLayout>;
};
