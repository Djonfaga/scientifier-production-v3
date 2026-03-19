import { defineConfig } from 'vite';
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';

const copyLegacyDataFiles = () => ({
    name: 'copy-legacy-data-files',
    writeBundle() {
        const targets = ['knowledge_data.js', 'blog_data.js'];
        mkdirSync('dist', { recursive: true });

        for (const file of targets) {
            if (existsSync(file)) {
                copyFileSync(file, `dist/${file}`);
            }
        }
    }
});

export default defineConfig({
    plugins: [copyLegacyDataFiles()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.html',
                chatbot: 'chatbot.html',
                method: 'method.html',
                programs: 'programs.html',
                knowledge: 'knowledge.html',
                pricing: 'pricing.html',
                contact: 'contact.html',
                demo: 'demo.html',
                blog: 'blog.html',
                blog_detail: 'blog_detail.html',
                detail: 'detail.html',
                dashboard: 'dashboard.html',
                admin_panel: 'admin_panel.html',
                login: 'login.html',
                signup: 'signup.html',
                privacy: 'privacy.html',
                terms: 'terms.html',
                mcp_dashboard: 'mcp-dashboard.html'
            }
        }
    },
    server: {
        proxy: {
            '^/api/': {
                target: process.env.VITE_API_URL || 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
