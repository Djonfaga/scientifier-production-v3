const STORAGE_KEYS = {
    users: 'scientifier.users',
    session: 'scientifier.session',
    feedback: 'scientifier.feedback',
    newsletter: 'scientifier.newsletter',
    conversations: 'scientifier.conversations',
};

const CHAT_ENDPOINT = '/api/chat';

function createId(prefix = 'id') {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `${prefix}_${crypto.randomUUID()}`;
    }
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeRead(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.warn(`Failed to read ${key} from storage`, error);
        return fallback;
    }
}

function safeWrite(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn(`Failed to write ${key} to storage`, error);
    }
}

function buildDefaultProgress() {
    return {
        level: 1,
        total_xp: 120,
        current_streak: 3,
        longest_streak: 3,
        total_lessons_completed: 2,
        total_time_minutes: 45,
        retention_rate: 88,
    };
}

function buildStarterAchievements() {
    return [
        {
            id: createId('achievement'),
            name: 'First Neural Session',
            icon: '🧠',
            date_unlocked: new Date().toISOString(),
        },
    ];
}

function sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
}

function normalizeFeedback(feedbackData = {}) {
    return {
        id: createId('feedback'),
        name: feedbackData.name || 'Anonymous',
        email: feedbackData.email || '',
        subject: feedbackData.subject || 'General Feedback',
        message: feedbackData.message || '',
        category: feedbackData.category || 'other',
        is_read: false,
        created_at: new Date().toISOString(),
    };
}

class ApiService {
    constructor() {
        this.token = null;
        this.refreshToken = null;
        this.bootstrap();
    }

    bootstrap() {
        const session = safeRead(STORAGE_KEYS.session, null);
        this.token = session?.token || null;
        this.refreshToken = session?.refresh || null;

        if (!Array.isArray(safeRead(STORAGE_KEYS.users, null))) {
            safeWrite(STORAGE_KEYS.users, []);
        }

        if (!Array.isArray(safeRead(STORAGE_KEYS.feedback, null))) {
            safeWrite(STORAGE_KEYS.feedback, []);
        }

        if (!Array.isArray(safeRead(STORAGE_KEYS.newsletter, null))) {
            safeWrite(STORAGE_KEYS.newsletter, []);
        }

        if (!Array.isArray(safeRead(STORAGE_KEYS.conversations, null))) {
            safeWrite(STORAGE_KEYS.conversations, []);
        }
    }

    setSession(user) {
        const session = {
            token: createId('session'),
            refresh: createId('refresh'),
            userId: user.id,
        };
        this.token = session.token;
        this.refreshToken = session.refresh;
        safeWrite(STORAGE_KEYS.session, session);
        return sanitizeUser(user);
    }

    clearSession() {
        this.token = null;
        this.refreshToken = null;
        try {
            localStorage.removeItem(STORAGE_KEYS.session);
        } catch (error) {
            console.warn('Failed to clear session', error);
        }
    }

    getUsers() {
        return safeRead(STORAGE_KEYS.users, []);
    }

    setUsers(users) {
        safeWrite(STORAGE_KEYS.users, users);
    }

    getCurrentUser() {
        const session = safeRead(STORAGE_KEYS.session, null);
        if (!session?.userId) return null;
        return this.getUsers().find((user) => user.id === session.userId) || null;
    }

    requireAuth() {
        const user = this.getCurrentUser();
        if (!user) {
            throw { status: 401, detail: 'Authentication required.' };
        }
        return user;
    }

    requireAdmin() {
        const user = this.requireAuth();
        if (!user.is_staff && !user.is_superuser) {
            throw { status: 403, detail: 'Administrator access required.' };
        }
        return user;
    }

    logout() {
        this.clearSession();
        if (typeof window !== 'undefined') {
            window.location.href = 'index.html';
        }
    }

    async login(email, password) {
        const users = this.getUsers();
        const match = users.find(
            (user) =>
                (user.email || '').toLowerCase() === String(email).toLowerCase().trim() &&
                user.password === password
        );

        if (!match) {
            throw { status: 401, detail: 'Invalid email or password.' };
        }

        return this.setSession(match);
    }

    async register(userData) {
        const users = this.getUsers();
        const email = String(userData.email || '').trim().toLowerCase();
        const username = String(userData.username || '').trim().toLowerCase();

        if (!email || !userData.password || !username) {
            throw { status: 400, detail: 'Email, username, and password are required.' };
        }

        if (users.some((user) => (user.email || '').toLowerCase() === email)) {
            throw { status: 400, email: ['A user with this email already exists.'] };
        }

        if (users.some((user) => (user.username || '').toLowerCase() === username)) {
            throw { status: 400, username: ['A user with this username already exists.'] };
        }

        const isFirstUser = users.length === 0;
        const newUser = {
            id: createId('user'),
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            username: String(userData.username || '').trim(),
            email,
            password: userData.password,
            created_at: new Date().toISOString(),
            subscription_tier: 'free',
            is_staff: isFirstUser,
            is_superuser: isFirstUser,
            progress: buildDefaultProgress(),
            achievements: buildStarterAchievements(),
        };

        users.push(newUser);
        this.setUsers(users);
        return sanitizeUser(newUser);
    }

    async getProfile() {
        return sanitizeUser(this.requireAuth());
    }

    async getCourses() {
        return { count: 0, results: [] };
    }

    async getCourseDetail() {
        throw {
            status: 404,
            detail: 'Dynamic Django course endpoints are not available in the Vercel build.',
        };
    }

    async updateProgress(lessonId, progressData = {}) {
        const user = this.requireAuth();
        const users = this.getUsers();
        const index = users.findIndex((item) => item.id === user.id);
        if (index === -1) {
            throw { status: 404, detail: 'User not found.' };
        }

        const current = users[index];
        const patch = {
            ...current.progress,
            ...progressData,
        };

        if (lessonId) {
            patch.total_lessons_completed = Math.max(
                Number(patch.total_lessons_completed || 0),
                Number(current.progress?.total_lessons_completed || 0) + 1
            );
        }

        users[index] = { ...current, progress: patch };
        this.setUsers(users);
        return sanitizeUser(users[index]);
    }

    async getConversations() {
        const user = this.requireAuth();
        const conversations = safeRead(STORAGE_KEYS.conversations, []);
        return conversations.filter((conversation) => conversation.userId === user.id);
    }

    async getMessages(conversationId) {
        const conversations = await this.getConversations();
        const conversation = conversations.find((item) => String(item.id) === String(conversationId));
        return conversation?.messages || [];
    }

    async chat(messages) {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw {
                status: response.status,
                detail: payload.error || payload.reply || 'Chat request failed.',
            };
        }

        return payload;
    }

    async subscribeNewsletter(email) {
        const value = String(email || '').trim().toLowerCase();
        if (!value) {
            throw { status: 400, detail: 'Email is required.' };
        }

        const entries = safeRead(STORAGE_KEYS.newsletter, []);
        if (!entries.some((entry) => entry.email === value)) {
            entries.push({
                id: createId('newsletter'),
                email: value,
                created_at: new Date().toISOString(),
            });
            safeWrite(STORAGE_KEYS.newsletter, entries);
        }

        return { ok: true };
    }

    async sendFeedback(feedbackData) {
        const entries = safeRead(STORAGE_KEYS.feedback, []);
        const feedback = normalizeFeedback(feedbackData);
        entries.unshift(feedback);
        safeWrite(STORAGE_KEYS.feedback, entries);
        return feedback;
    }

    async getAdminUsers() {
        this.requireAdmin();
        return this.getUsers().map((user) => sanitizeUser(user));
    }

    async getAdminFeedback() {
        this.requireAdmin();
        return safeRead(STORAGE_KEYS.feedback, []);
    }

    async markFeedbackRead(id) {
        this.requireAdmin();
        const entries = safeRead(STORAGE_KEYS.feedback, []);
        const updated = entries.map((entry) =>
            String(entry.id) === String(id) ? { ...entry, is_read: true } : entry
        );
        safeWrite(STORAGE_KEYS.feedback, updated);
        return { ok: true };
    }
}

export const api = new ApiService();
