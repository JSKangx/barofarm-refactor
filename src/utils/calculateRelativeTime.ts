export default function calculateRelativeTime(createdDate: string) {
  const formatRelativeTime = (inputDate: string) => {
    // 타입스크립트에서는 뺄셈을 하려면 명시적으로 타임스탬프로 변환해야함
    const now = new Date().getTime();
    const pastDate = new Date(inputDate).getTime();
    // 글이 올라온 시각과 현재 시각의 차이 계산
    const minDiff = Math.floor((now - pastDate) / (1000 * 60));
    // 뺄셈 값에 따른 표기
    if (minDiff < 1) return "방금 전";
    if (minDiff < 60) return `${minDiff}분 전`;
    if (minDiff < 1440) return `${Math.floor(minDiff / 60)}시간 전`;
    if (minDiff < 2880) return `${Math.floor(minDiff / 1440)}일 전`;

    // 이틀 이상인 경우에는 날짜를 표시 - 명시적 형식 사용(하이드레이션 에러 방지)
    const date = new Date(pastDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년, ${month}월 ${day}일`;
  };
  return formatRelativeTime(createdDate);
}
