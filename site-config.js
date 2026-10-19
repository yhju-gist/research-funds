// 학생·교수용 안내 홈페이지 설정 (이 파일만 고치면 됩니다)
window.SITE = {
  deptName: "환경·에너지공학과",
  officeName: "공과대학 교학팀 연구비 담당",
  officeRoom: "신재생에너지연구동(C10) 216호",
  officeTel: "[내선 입력]",            // 예: "062-715-0000"
  officeEmail: "[이메일 입력]",         // 예: "xxx@gist.ac.kr"
  // 접수함 백엔드 주소 (backend/설치가이드.md 3단계에서 복사한 웹 앱 URL). 비어 있으면 메일 접수로 동작합니다.
  apiUrl: "https://script.google.com/macros/s/AKfycbz8jPNwsMlv22vWmQmgHKPxu0PsHiijFJcBnwnE4WNJ4DrUgvGZHajXQV1ebqcqyip3Tg/exec",
  // 요청 폼의 교수님 목록 (담당 교수님이 바뀌면 여기와 런처 data/people.js를 같이 고칩니다)
  professors: ["강성봉","김상돈","김은석","김인수","김준하","김창우","이윤호"],
  formsFolder: "forms/",
  updated: "2026-10-19"
};
