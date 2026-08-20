import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// 스타일시트 캐시 무효화 값은 파일 내용에서 만든다.
// 손으로 적는 버전 문자열은 잊어버리기 쉽고, 실제로 2026-07-07 이후 styles.css가
// 9번 3,200줄 넘게 바뀌는 동안 문자열이 그대로여서 재방문자가 몇 주간 옛 CSS로
// 새 마크업을 보는 문제가 있었다. 내용이 바뀌면 값도 반드시 바뀌도록 해시로 만든다.
//
// import.meta.url은 빌드 시 번들된 청크 위치로 풀리므로 쓰지 않는다.
// astro dev와 astro build 모두 프로젝트 루트에서 실행되므로 cwd를 기준으로 읽는다.
const fileHash = (relativePath) =>
  createHash('sha1').update(readFileSync(join(process.cwd(), relativePath))).digest('hex').slice(0, 10);

export const stylesVersion = fileHash('public/styles.css');
