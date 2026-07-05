export function formatIDR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export function formatIDRShort(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) return 'Rp 0';
  
  if (amount < 1000) {
    return `Rp ${amount}`;
  }
  
  if (amount < 1000000) {
    const value = amount / 1000;
    const formatted = Number(value.toFixed(1)).toLocaleString('id-ID');
    return `Rp ${formatted}rb`;
  }
  
  if (amount < 1000000000) {
    const value = amount / 1000000;
    const formatted = Number(value.toFixed(1)).toLocaleString('id-ID');
    return `Rp ${formatted} Jt`;
  }
  
  const value = amount / 1000000000;
  const formatted = Number(value.toFixed(1)).toLocaleString('id-ID');
  return `Rp ${formatted} M`;
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}

export function formatTime(timestampString: string): string {
  const date = new Date(timestampString);
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
}

export function getDaysAgo(dateString: string): string {
  const dateObj = new Date(dateString);
  const today = new Date();
  
  // Clear times to compare days only
  const d1 = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const d2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = d2 - d1;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  return `${diffDays} hari lalu`;
}
