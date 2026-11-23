// Commits a file to the GitHub repo, which makes Vercel redeploy the site (~1 minute).
// Needs GITHUB_TOKEN: a fine-grained token with "Contents: Read and write" on this repo only.
const repo = () => process.env.GITHUB_REPO || "dannybutterfield1880/blocks-dropship";

export const githubConfigured = () => !!process.env.GITHUB_TOKEN;

export async function commitFile(path: string, content: string, message: string) {
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const url = `https://api.github.com/repos/${repo()}/contents/${path}`;

  const current = await fetch(`${url}?ref=main`, { headers, cache: "no-store" });
  const sha = current.ok ? (await current.json()).sha : undefined;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: Buffer.from(content).toString("base64"), sha, branch: "main" }),
  });
  if (!res.ok) throw new Error(`GitHub save failed (${res.status}): ${(await res.text()).slice(0, 200)}`);
}
