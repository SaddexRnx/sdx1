import { Tool } from '@/types/tool';

export function exportToCSV(tools: Tool[], filename: string = 'ai-tools-export') {
  const headers = ['Name', 'Description', 'Website', 'Category', 'Pricing', 'Tags'];
  const rows = tools.map(tool => [
    tool.name,
    tool.description.replace(/"/g, '""'), // Escape quotes
    tool.url,
    tool.category,
    tool.pricing,
    tool.tags.join('; ')
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function exportToJSON(tools: Tool[], filename: string = 'ai-tools-export') {
  const jsonContent = JSON.stringify(tools, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  link.click();
}

export function shareOnTwitter(tool: Tool) {
  const text = `Check out ${tool.name}: ${tool.description.slice(0, 100)}...`;
  const url = encodeURIComponent(tool.url);
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
}

export function shareOnLinkedIn(tool: Tool) {
  const url = encodeURIComponent(tool.url);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

export function shareOnWhatsApp(tool: Tool) {
  const text = `Check out ${tool.name}: ${tool.description.slice(0, 100)}... ${tool.url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    return true;
  }).catch(() => {
    return false;
  });
}
