# CollaboAtlas

디자이너와 AI의 역할 지도. 박사학위 논문의 단계적 역할 전환(Stage-Based Role Transition, SBRT) 모델을 보여 주는 정적 웹 애플리케이션이다. 빌드 도구나 패키지 설치 없이 동작한다.

## 실행

    python3 -m http.server 8000
    # http://localhost:8000/index.html

전시용 단일 파일은 `CollaboAtlas-Exhibition.html`이다. 인터넷 없이 Chrome에서 바로 열 수 있다.

## 구성

- `index.html`, `css/atlas.css`, `js/`: 편집용 소스. 같은 함수를 뒤의 스크립트가 덮어쓰는 구조이므로 index.html의 스크립트 순서를 지킨다.
- `js/exhibition.js`: Atlas·SBRT 화면, 그림 6-1 곡선(exSeries), 인터뷰 표
- `js/map07-graphics.js`: 중앙 원형 분류 지도(Buchanan · KIDP · Axis)
- `js/data.js`, `js/map07-data.js`, `chips.json`, `map07-evidence.json`: 정의와 자료
- `assets/`, `downloads/`: 도판과 내려받기 자료
- `build.py`: 소스를 고친 뒤 `python3 build.py`로 단일 전시 파일을 다시 만든다.
- `CLAUDE.md`: 작업 인계 메모

## 기록

Log의 프로젝트 기록은 사용하는 브라우저의 IndexedDB에만 저장된다. 다른 기기로 옮기려면 Log의 JSON 백업을 쓴다.
