# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🛠️ Development Commands

### Core Commands
```bash
# Installation & Setup
npm install                     # Install all dependencies (workspaces)
docker-compose up -d            # Start local services

# Development
npm run dev                     # Run all services in parallel
npm run dev:praxiswissen       # Run specific service
npm run dev:database-sync      
npm run dev:event-parser       

# Building
npm run build                  # Build shared libs + all services
npm run build:shared           # Build shared components only
npm run build:services         # Build all services in parallel

# Testing
npm run test                   # Run all tests (unit + e2e + integration)
npm run test:unit              # Run unit tests with Vitest
npm run test:e2e               # Run Playwright E2E tests
npm run test:integration       # Run integration tests

# Code Quality
npm run lint                   # ESLint check (.ts, .tsx)
npm run typecheck              # TypeScript type checking
npm run format                 # Prettier formatting

# Deployment
npm run deploy:staging         # Deploy to staging environment
npm run deploy:production      # Deploy to production
```

### Service-Specific Development
Each service can be run independently:
```bash
cd services/praxiswissen-search && npm run dev
cd services/database-sync && npm run dev
cd services/event-parser && npm run dev
```

## 🏗️ Architecture Overview

### Monorepo Structure
- **Workspaces**: Root manages `shared` and `services/*` via npm workspaces
- **Shared Module**: `@mica/shared` contains auth, components, utils, types, and API clients
- **Services**: Independent microservices deployed to Cloudflare Workers
- **Deployment**: Each service has its own `wrangler.toml` for Cloudflare deployment

### Key Technologies
- **Runtime**: Cloudflare Workers (edge computing)
- **AI/LLM**: Google Gemini AI (user provides API keys)
- **Storage**: Cloudflare KV (cache), D1 (database), R2 (files)
- **Frontend**: React + TypeScript + Vite
- **Testing**: Vitest (unit), Playwright (E2E)

## 🏗️ Architecture Principles

### 1. **Modular Microservices**
- Each solution is an independent service
- Shared authentication via JWT
- Common component library
- API gateway for routing

### 2. **AI-First Development**
- Use LLMs for intelligent processing
- Implement RAG for knowledge retrieval
- Apply computer vision for image tasks
- Leverage NLP for text understanding

### 3. **Data Integrity**
- PostgreSQL for structured data
- Redis for caching and sessions
- Elasticsearch for full-text search
- Vector DB for embeddings

### 4. **GDPR Compliance**
- Mistral AI option for EU data
- Encryption at rest and transit
- User consent management
- Audit logging


## 🔑 Key Implementation Guidelines

### 1. **Authentication**
- Use shared JWT authentication
- Implement role-based access control
- Support SSO via OAuth 2.0
- Session management in Redis

### 2. **Data Processing**
- Batch operations for efficiency
- Queue long-running tasks
- Implement retry logic
- Use transactions for consistency

### 3. **AI Integration**
```typescript
// Standard AI integration pattern
import { AIProcessor } from '@mica/shared/ai';

const processor = new AIProcessor({
  provider: 'mistral', // or 'openai'
  model: 'large-latest',
  temperature: 0.3,
  maxTokens: 2000
});

const result = await processor.process({
  task: 'extract',
  input: data,
  schema: extractionSchema,
  language: 'de'
});
```

### 4. **Error Handling**
```typescript
// Consistent error handling
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed', { error, context });
  return { 
    success: false, 
    error: error.message,
    code: error.code || 'UNKNOWN_ERROR'
  };
}
```

### 5. **Database Patterns**
```typescript
// Use repository pattern
class ArtistRepository {
  async findByName(name: string): Promise<Artist[]> {
    return db.query(
      'SELECT * FROM artists WHERE name ILIKE $1',
      [`%${name}%`]
    );
  }
  
  async updateBiography(id: string, bio: string): Promise<void> {
    await db.transaction(async (trx) => {
      await trx.query(
        'UPDATE artists SET biography = $1, updated_at = NOW() WHERE id = $2',
        [bio, id]
      );
      await this.logChange(trx, id, 'biography', bio);
    });
  }
}
```

## 📊 Performance Requirements

- **Response Time**: <500ms for API calls
- **Processing Time**: <5s for AI operations
- **Batch Processing**: 1000+ items/minute
- **Concurrent Users**: Support 500+
- **Uptime**: 99.9% availability

## 🔐 Security Checklist

- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] API key rotation
- [ ] Audit logging
- [ ] Data encryption
- [ ] Secure headers
- [ ] Regular security scans

## 🧪 Testing Requirements

### Unit Tests
- Minimum 80% code coverage
- Test all business logic
- Mock external dependencies

### Integration Tests
- Test API endpoints
- Database operations
- External service integration

### E2E Tests
- Critical user journeys
- Cross-browser testing
- Mobile responsiveness

## 📝 Code Style

### TypeScript
```typescript
// Use explicit types
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

// Async/await over promises
async function fetchUser(id: string): Promise<UserData> {
  const user = await db.findById(id);
  if (!user) {
    throw new NotFoundError(`User ${id} not found`);
  }
  return user;
}

// Functional approach where appropriate
const activeUsers = users
  .filter(user => user.isActive)
  .map(user => ({
    id: user.id,
    name: user.name
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
```

### React Components
```tsx
// Functional components with TypeScript
interface Props {
  title: string;
  onSave: (data: FormData) => Promise<void>;
}

export const EditForm: React.FC<Props> = ({ title, onSave }) => {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(new FormData(e.target as HTMLFormElement));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      {/* form fields */}
      <button disabled={loading}>Save</button>
    </form>
  );
};
```

## 🚀 Deployment Strategy

### Staging Environment
- Automatic deployment on develop branch
- Full testing suite runs
- Manual approval for production

### Production Deployment
1. Create release branch
2. Run full test suite
3. Deploy to canary (10% traffic)
4. Monitor for 1 hour
5. Full production rollout
6. Post-deployment verification

## 📊 Monitoring

### Application Metrics
- Request/response times
- Error rates
- API usage
- Database performance

### Business Metrics
- User engagement
- Task completion rates
- Time savings
- Data accuracy

### Alerts
- Error rate > 1%
- Response time > 1s
- Database connection issues
- AI service failures

## 🔄 Data Flow Patterns

### Synchronization Pattern
```
External Source → Scraper → Validator → Differ → Database → Notification
```

### Processing Pattern
```
Input → Parser → AI Processor → Validator → Transformer → Output
```

### Analytics Pattern
```
Raw Data → Aggregator → Analyzer → Insights Generator → Dashboard
```

## 📚 Documentation Standards

### Code Documentation
- JSDoc for all public functions
- README in each service directory
- API documentation via OpenAPI
- Inline comments for complex logic

### User Documentation
- Step-by-step guides
- Video tutorials
- FAQ sections
- Troubleshooting guides

## 🎯 Success Criteria

Each solution must:
1. Solve the specific pain point
2. Reduce manual work by 80%+
3. Maintain 95%+ accuracy
4. Provide sub-second response
5. Include comprehensive logging
6. Support German and English
7. Be fully GDPR compliant
8. Include user training

## 🌐 Cloudflare Worker Deployment

### Wrangler CLI
```bash
# Deploy individual service
cd services/praxiswissen-search
wrangler deploy

# Deploy all services
./deploy-all.sh

# Local development with Wrangler
wrangler dev --local
```

### Environment Variables
Each service needs Cloudflare KV namespaces and D1 databases configured in `wrangler.toml`:
```toml
kv_namespaces = [
  { binding = "CACHE", id = "your-kv-id" }
]

[[d1_databases]]
binding = "DB"
database_name = "mica-db"
database_id = "your-db-id"
```

## 🔑 API Integration Pattern

### User-Provided API Keys
Services use client-side API keys for Gemini AI:
```typescript
// Client stores key in localStorage
const apiKey = localStorage.getItem('gemini_api_key');

// Pass to worker via headers
fetch('/api/chat', {
  headers: { 
    'X-API-Key': apiKey 
  }
})
```

## 📊 Key Pain Points Being Solved

1. **Praxiswissen Search**: Replace manual FAQ responses with AI-powered instant answers
2. **Database Sync**: Automate manual data entry from 100+ artist websites
3. **Event Parser**: Extract structured event data from unstructured emails/PDFs
4. **Festival Updater**: Keep festival participant lists current automatically
5. **Biography Manager**: Synchronize artist bios across multiple platforms

## 🧪 Testing Strategy

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test service interactions and external API calls
- **E2E Tests**: Test complete user workflows in browser

Run specific test suites:
```bash
npm run test:unit -- services/praxiswissen-search
npm run test:e2e -- --grep "chat interface"
```