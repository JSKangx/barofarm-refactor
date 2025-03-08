type CategoryProps = {
  params: {
    category: string;
  };
};
export default function Category({ params }: CategoryProps) {
  const { category } = params;
  return <h1>{category}</h1>;
}
