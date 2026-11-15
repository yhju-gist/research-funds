// 학생·교수용 안내 홈페이지 설정 (이 파일만 고치면 됩니다)
window.SITE = {
  deptName: "환경·에너지공학과",
  officeName: "환경·에너지공학과 연구비 담당",
  officeRoom: "지구환경공학동(S6) 환경·에너지공학과 학과사무실",   // 종이 원본 제출 장소
  officeTel: "[내선 입력]",            // 예: "062-715-0000"
  officeEmail: "[이메일 입력]",         // 예: "xxx@gist.ac.kr"
  // 접수함 백엔드 주소 (backend/설치가이드.md 3단계에서 복사한 웹 앱 URL). 비어 있으면 메일 접수로 동작합니다.
  apiUrl: "https://script.google.com/macros/s/AKfycbz8jPNwsMlv22vWmQmgHKPxu0PsHiijFJcBnwnE4WNJ4DrUgvGZHajXQV1ebqcqyip3Tg/exec",
  // 요청 폼의 교수님 목록 (담당 교수님이 바뀌면 여기와 런처 data/people.js를 같이 고칩니다)
  professors: ["강성봉","강창근","김상돈","김은석","김인수","김준하","김창우","김태영","김형록","민경은","박기홍","박영준","송철한","윤진호","이윤호","이재영","장인섭","주종훈","최희철","한승희","허호길","황희정"], // 학과 전임교수 21명(학과 홈페이지 2026-10-21) + 김인수(초빙석학)
  formsFolder: "forms/",
  updated: "2026-10-21"
};
