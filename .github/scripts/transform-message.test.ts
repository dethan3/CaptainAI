import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./transform-message.ts', import.meta.url));
const base = {
  actor: 'fixture', server_url: 'https://github.com', repository: 'fixture/repo',
  action: '__run', ref: 'refs/heads/check', ref_name: 'check',
};

function serialize(event: object) {
  const result = spawnSync(process.execPath, ['--experimental-strip-types', script], {
    input: JSON.stringify(event), encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout).post.zh_cn;
}

test('PR payload action, apostrophes and multiline text survive serialization', () => {
  const body = 'Literal $(command), `code`, an apostrophe: \'\nSecond line';
  const message = serialize({ ...base, event_name: 'pull_request', event: {
    action: 'opened', pull_request: {
      title: "Maintainer's PR", body, html_url: 'https://github.com/fixture/repo/pull/1',
      user: { login: 'fixture', html_url: 'https://github.com/fixture' }, labels: [],
    },
  } });
  assert.equal(message.title, "GitHub PR 打开：Maintainer's PR");
  assert.equal(message.content.at(-1)[1].text, body);
});

test('branch creation push without head_commit uses a branch link', () => {
  const message = serialize({ ...base, event_name: 'push', event: { head_commit: null } });
  assert.equal(message.content[0][1].href, 'https://github.com/fixture/repo/tree/check');
  assert.equal(message.content.at(-1)[1].text, '分支引用更新');
});
