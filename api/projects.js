export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_REPO = process.env.GITHUB_REPO;
  const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
  const FILE_PATH = 'data/projects.json';

  const requireAuth = () => {
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
      return false;
    }
    return true;
  };

  const githubRequest = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(options.headers || {})
      }
    });
    return response;
  };

  if (req.method === 'GET') {
    try {
      if (requireAuth()) {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`;
        const response = await githubRequest(url);
        if (!response.ok) {
          return res.status(response.status).json({ projects: [] });
        }
        const data = await response.json();
        const content = Buffer.from(data.content || '', 'base64').toString('utf8');
        const projects = content ? JSON.parse(content) : [];
        return res.status(200).json(projects);
      }

      // No GitHub env available: read from local file (dev)
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), FILE_PATH);
      if (!fs.existsSync(filePath)) {
        return res.status(200).json([]);
      }
      const content = fs.readFileSync(filePath, 'utf8');
      const projects = content ? JSON.parse(content) : [];
      return res.status(200).json(projects);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to load projects' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { projects } = req.body || {};
      if (!Array.isArray(projects)) {
        return res.status(400).json({ error: 'Invalid payload' });
      }

      if (requireAuth()) {
        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
        let sha = undefined;

        const existing = await githubRequest(`${url}?ref=${GITHUB_BRANCH}`);
        if (existing.ok) {
          const data = await existing.json();
          sha = data.sha;
        }

        const content = Buffer.from(JSON.stringify(projects, null, 2)).toString('base64');
        const response = await githubRequest(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Update portfolio projects via admin',
            content,
            branch: GITHUB_BRANCH,
            sha
          })
        });

        if (!response.ok) {
          return res.status(response.status).json({ error: 'GitHub update failed' });
        }

        return res.status(200).json({ ok: true });
      }

      // No GitHub env available: write to local file (dev)
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), FILE_PATH);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf8');
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save projects' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end('Method Not Allowed');
}
