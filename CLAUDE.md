# CLAUDE.md - MICA Solutions Development Guide

This file provides guidance to Claude Code when working with the MICA Solutions Platform.

## 🎯 Project Mission

Transform Music Austria's digital operations through AI-powered automation, solving real pain points with practical, production-ready solutions.

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

## 📁 Project Structure

```
/dev/mica/
├── PROJECT_BRIEFING.md        # Comprehensive project overview
├── CLAUDE.md                   # This file
├── README.md                   # Public documentation
├── package.json                # Root package management
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment variables template
├── docker-compose.yml         # Local development setup
│
├── shared/                    # Shared components and utilities
│   ├── auth/                 # Authentication module
│   ├── components/           # Reusable UI components
│   ├── utils/               # Common utilities
│   ├── types/               # TypeScript definitions
│   └── api/                 # API client libraries
│
├── services/                  # Individual solutions
│   ├── praxiswissen-search/ # AI chatbot
│   ├── database-sync/       # Data synchronization
│   ├── event-parser/        # Email processing
│   ├── festival-updater/    # List maintenance
│   ├── biography-manager/   # Bio updates
│   ├── works-catalog/       # Catalog management
│   ├── analytics-dashboard/ # Matomo integration
│   ├── crm-updater/        # CRM automation
│   ├── workshop-insights/   # Registration analysis
│   ├── music-map/          # Interactive map
│   ├── transcription-hub/  # Audio to text
│   ├── report-generator/   # Automated reports
│   ├── photo-processor/    # Image optimization
│   ├── seo-optimizer/      # SEO analysis
│   └── office-assistant/   # Task automation
│
├── infrastructure/           # Deployment configurations
│   ├── cloudflare/         # Workers and Pages config
│   ├── docker/             # Container definitions
│   ├── kubernetes/         # K8s manifests
│   └── terraform/          # Infrastructure as Code
│
├── scripts/                 # Automation scripts
│   ├── deploy.sh          # Deployment automation
│   ├── backup.sh          # Backup procedures
│   └── migrate.sh         # Database migrations
│
└── docs/                   # Documentation
    ├── api/               # API documentation
    ├── user-guides/       # User manuals
    └── technical/         # Technical docs
```

## 🛠️ Development Commands

### Initial Setup
```bash
# Clone and setup
git clone https://github.com/franzenzenhofer/mica-solutions.git
cd mica-solutions
npm install
cp .env.example .env

# Start local services
docker-compose up -d
npm run dev
```

### Individual Services
```bash
# Development
npm run dev:praxiswissen       # Start Praxiswissen search
npm run dev:database-sync      # Start Database sync
npm run dev:event-parser       # Start Event parser
# ... etc for each service

# Building
npm run build:all              # Build all services
npm run build:praxiswissen     # Build specific service

# Testing
npm run test                   # Run all tests
npm run test:e2e              # End-to-end tests
npm run test:integration      # Integration tests
```

### Deployment
```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Deploy specific service
npm run deploy:praxiswissen --env=production
```

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

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection**
   - Check connection string
   - Verify network access
   - Check connection pool

2. **AI Service Errors**
   - Verify API keys
   - Check rate limits
   - Review token usage

3. **Performance Issues**
   - Check database indexes
   - Review caching strategy
   - Analyze query patterns

## 📞 Support Channels

- **Development**: dev@mica.franzai.com
- **Issues**: GitHub Issues
- **Slack**: #mica-dev
- **Documentation**: docs.mica.franzai.com

---

**Remember**: Always prioritize solving the real problem over technical elegance. These tools must work reliably for non-technical users in production environments.