// 인증 관련 핸들로 함수들을 가져옴
import { handlers } from "auth";

// 가져온 핸들러에서 GET과 POST 메서드 핸들러를 추출하여 다시 내보냄
export const { GET, POST } = handlers;
