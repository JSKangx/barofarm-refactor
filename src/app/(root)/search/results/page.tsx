import { SearchParams } from "app/(board)/board/page";
import ResultClient from "components/_/search/ResultClient";
import { fetchApi } from "lib/api";
import { ProductsResponse } from "type/product";

interface Props {
  searchParams: SearchParams;
}

export default async function SearchResult({ searchParams }: Props) {
  // 검색어 추출
  const searchKeyword = searchParams.keyword;
  // sort type 추출
  const sortType = searchParams.sort || '{"createdAt":-1}';

  // 검색어와 sort type으로 data fetching
  const res: ProductsResponse = await fetchApi(
    `/products?keyword=${searchKeyword}&sort=${sortType}`
  );
  const data = res.item;

  return (
    <ResultClient
      searchKeyword={searchKeyword}
      sortType={sortType}
      data={data}
    />
  );
}
