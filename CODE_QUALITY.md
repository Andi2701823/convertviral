# Code Quality Guidelines

## Overview

This document outlines the code quality standards, best practices, and guidelines for the ConvertViral project. Following these guidelines ensures maintainable, scalable, and reliable code.

## 🎯 Quality Standards

### Code Coverage
- **Minimum:** 70% overall coverage
- **Target:** 80% overall coverage
- **Critical paths:** 90% coverage required

### Performance Budgets
- **Bundle size:** < 250KB gzipped
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1

### Code Quality Metrics
- **ESLint errors:** 0 tolerance
- **TypeScript errors:** 0 tolerance
- **Security vulnerabilities:** 0 high/critical
- **Accessibility:** WCAG 2.1 AA compliance

## 📋 Development Workflow

### Pre-commit Checklist
```bash
# Run quality checks
npm run quality:check

# Fix formatting and linting issues
npm run quality:fix

# Verify tests pass
npm run test
```

### Branch Protection
- All PRs require quality gate approval
- Minimum 1 code review required
- All CI checks must pass
- Branch must be up-to-date with main

## 🏗️ Architecture Guidelines

### File Organization
```
app/
├── (routes)/           # App Router pages
├── api/               # API routes
└── globals.css        # Global styles

components/
├── ui/                # Reusable UI components
├── forms/             # Form components
├── layout/            # Layout components
└── features/          # Feature-specific components

lib/
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── services/          # API services
└── types/             # Type definitions

types/
├── api.ts             # API response types
├── components.ts      # Component prop types
└── global.d.ts        # Global type declarations
```

### Component Guidelines

#### 1. Component Structure
```typescript
// ✅ Good: Clear structure with proper typing
interface ComponentProps {
  title: string;
  onAction: (id: string) => void;
  isLoading?: boolean;
}

export function Component({ title, onAction, isLoading = false }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState<string>('');
  
  // Event handlers
  const handleClick = useCallback((id: string) => {
    onAction(id);
  }, [onAction]);
  
  // Early returns
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  // Main render
  return (
    <div className="component">
      <h1>{title}</h1>
      {/* Component content */}
    </div>
  );
}
```

#### 2. Props Interface
```typescript
// ✅ Good: Descriptive and well-typed
interface FileUploaderProps {
  acceptedTypes: string[];
  maxFileSize: number;
  onUpload: (files: File[]) => Promise<void>;
  onError: (error: Error) => void;
  disabled?: boolean;
  multiple?: boolean;
}

// ❌ Bad: Vague and poorly typed
interface Props {
  data: any;
  callback: Function;
}
```

### State Management

#### 1. Local State
```typescript
// ✅ Good: Proper typing and initialization
const [uploadProgress, setUploadProgress] = useState<number>(0);
const [files, setFiles] = useState<File[]>([]);
const [error, setError] = useState<string | null>(null);

// ❌ Bad: No typing
const [data, setData] = useState();
```

#### 2. Complex State
```typescript
// ✅ Good: useReducer for complex state
interface ConversionState {
  status: 'idle' | 'uploading' | 'converting' | 'complete' | 'error';
  progress: number;
  result?: ConversionResult;
  error?: string;
}

function conversionReducer(state: ConversionState, action: ConversionAction): ConversionState {
  switch (action.type) {
    case 'START_UPLOAD':
      return { ...state, status: 'uploading', progress: 0 };
    // ... other cases
  }
}
```

## 🧪 Testing Guidelines

### Test Structure
```typescript
// ✅ Good: Descriptive test structure
describe('FileConverter', () => {
  describe('when uploading files', () => {
    it('should show upload progress', async () => {
      // Arrange
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      const onUpload = jest.fn();
      
      // Act
      render(<FileConverter onUpload={onUpload} />);
      const input = screen.getByLabelText(/upload/i);
      await userEvent.upload(input, mockFile);
      
      // Assert
      expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Priorities
1. **Critical user flows** (file upload, conversion)
2. **Error handling** (network failures, invalid files)
3. **Edge cases** (large files, unsupported formats)
4. **Accessibility** (keyboard navigation, screen readers)

## 🔒 Security Guidelines

### Input Validation
```typescript
// ✅ Good: Proper validation with Zod
const FileUploadSchema = z.object({
  file: z.instanceof(File)
    .refine(file => file.size <= MAX_FILE_SIZE, 'File too large')
    .refine(file => ALLOWED_TYPES.includes(file.type), 'Invalid file type'),
  metadata: z.object({
    originalName: z.string().min(1).max(255),
    uploadedAt: z.date()
  })
});

// Validate before processing
const result = FileUploadSchema.safeParse(input);
if (!result.success) {
  throw new ValidationError(result.error.message);
}
```

### Environment Variables
```typescript
// ✅ Good: Validated environment variables
const env = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_')
}).parse(process.env);

// ❌ Bad: Direct access without validation
const dbUrl = process.env.DATABASE_URL; // Could be undefined
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices
```typescript
// ✅ Good: Semantic class grouping
const buttonClasses = cn(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  // Interactive states
  'hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2',
  // Variants
  variant === 'primary' && 'bg-blue-600 text-white focus:ring-blue-500',
  variant === 'secondary' && 'bg-gray-200 text-gray-900 focus:ring-gray-500',
  // Size variants
  size === 'sm' && 'px-3 py-2 text-xs',
  size === 'md' && 'px-4 py-2 text-sm',
  // State modifiers
  disabled && 'opacity-50 cursor-not-allowed'
);

// ❌ Bad: Long, unorganized class strings
const badClasses = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50";
```

## 📊 Performance Guidelines

### Code Splitting
```typescript
// ✅ Good: Lazy loading for large components
const FileConverter = lazy(() => import('./FileConverter'));
const AdminDashboard = lazy(() => import('./AdminDashboard'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <FileConverter />
</Suspense>
```

### Image Optimization
```typescript
// ✅ Good: Next.js Image component with optimization
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="File conversion interface"
  width={800}
  height={600}
  priority={true}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

## 🌐 Internationalization

### Translation Keys
```typescript
// ✅ Good: Hierarchical, descriptive keys
const t = useTranslations('fileConverter');

// In translation files
{
  "fileConverter": {
    "upload": {
      "title": "Upload Your Files",
      "description": "Drag and drop files or click to browse",
      "errors": {
        "fileTooLarge": "File size exceeds {maxSize}MB limit",
        "invalidType": "File type {type} is not supported"
      }
    }
  }
}

// Usage
t('upload.title')
t('upload.errors.fileTooLarge', { maxSize: 10 })
```

## 🔍 Monitoring & Observability

### Error Tracking
```typescript
// ✅ Good: Structured error reporting
import * as Sentry from '@sentry/nextjs';

try {
  await convertFile(file);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'file-conversion',
      fileType: file.type,
      fileSize: file.size
    },
    user: {
      id: user.id,
      email: user.email
    },
    extra: {
      fileName: file.name,
      conversionSettings: settings
    }
  });
  
  throw new ConversionError('Failed to convert file', { cause: error });
}
```

### Performance Monitoring
```typescript
// ✅ Good: Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Send to your analytics service
  analytics.track('web-vital', {
    name: metric.name,
    value: metric.value,
    id: metric.id,
    delta: metric.delta
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 📝 Documentation Standards

### Component Documentation
```typescript
/**
 * FileUploader component for handling file uploads with drag-and-drop support.
 * 
 * @example
 * ```tsx
 * <FileUploader
 *   acceptedTypes={['image/*', 'application/pdf']}
 *   maxFileSize={10 * 1024 * 1024} // 10MB
 *   onUpload={handleUpload}
 *   onError={handleError}
 * />
 * ```
 */
interface FileUploaderProps {
  /** Array of accepted MIME types or file extensions */
  acceptedTypes: string[];
  /** Maximum file size in bytes */
  maxFileSize: number;
  /** Callback fired when files are successfully uploaded */
  onUpload: (files: File[]) => Promise<void>;
  /** Callback fired when an error occurs */
  onError: (error: Error) => void;
}
```

### API Documentation
```typescript
/**
 * Converts a file from one format to another.
 * 
 * @param file - The file to convert
 * @param targetFormat - The desired output format
 * @param options - Conversion options
 * @returns Promise that resolves to the converted file
 * 
 * @throws {ValidationError} When file or format is invalid
 * @throws {ConversionError} When conversion fails
 * 
 * @example
 * ```typescript
 * const convertedFile = await convertFile(
 *   file,
 *   'pdf',
 *   { quality: 'high', compression: true }
 * );
 * ```
 */
export async function convertFile(
  file: File,
  targetFormat: SupportedFormat,
  options: ConversionOptions = {}
): Promise<ConvertedFile> {
  // Implementation
}
```

## 🚀 Deployment Guidelines

### Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
SKIP_ENV_VALIDATION=false

# Security headers
CONTENT_SECURITY_POLICY="default-src 'self'; script-src 'self' 'unsafe-eval'"
X_FRAME_OPTIONS=DENY
X_CONTENT_TYPE_OPTIONS=nosniff
```

### Build Optimization
```javascript
// next.config.js
module.exports = {
  // Bundle analyzer
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true'
  },
  
  // Compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30 // 30 days
  },
  
  // Performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@heroicons/react']
  }
};
```

---

## 📋 Quality Checklist

### Before Every Commit
- [ ] All tests pass (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Accessibility considerations addressed

### Before Every Release
- [ ] All quality gates pass (`npm run quality:check`)
- [ ] Performance budgets met
- [ ] Security audit clean (`npm audit`)
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped appropriately

---

*This document is living and should be updated as the project evolves.*