import { ExternalLink, Lock, Unlock, Star } from 'lucide-react';

interface APICardProps {
  api: {
    id: string;
    name: string;
    description: string;
    category: string;
    url: string;
    documentation_url?: string;
    authentication_required: boolean;
    auth_type: string;
    rate_limit?: string;
    free_tier: boolean;
    tags: string[];
    featured: boolean;
  };
}

export function APICard({ api }: APICardProps) {
  return (
    <div className="bg-secondary border-pixel p-6 hover:shadow-pixel transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-primary group-hover:underline">
              {api.name}
            </h3>
            {api.featured && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-1 bg-primary text-secondary border-pixel font-mono">
              {api.category}
            </span>
            {api.free_tier && (
              <span className="text-xs px-2 py-1 bg-green-500 text-white border-pixel font-mono">
                FREE
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-secondary mb-4 line-clamp-3">
        {api.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs">
          {api.authentication_required ? (
            <Lock className="w-3 h-3" />
          ) : (
            <Unlock className="w-3 h-3" />
          )}
          <span className="font-mono">
            Auth: {api.auth_type}
          </span>
        </div>
        {api.rate_limit && (
          <div className="text-xs font-mono text-secondary">
            Rate Limit: {api.rate_limit}
          </div>
        )}
      </div>

      {api.tags && api.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {api.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 bg-primary/10 border border-primary/20 font-mono"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <a
          href={api.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-secondary font-bold text-sm border-pixel hover:shadow-pixel transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Visit API
        </a>
        {api.documentation_url && (
          <a
            href={api.documentation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-secondary text-primary font-bold text-sm border-pixel hover:shadow-pixel transition-all"
            title="Documentation"
          >
            Docs
          </a>
        )}
      </div>
    </div>
  );
}
