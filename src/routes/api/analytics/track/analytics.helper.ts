export const AnalyticsHelpers = {
	hashIp(ip: string) {
		return crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip)).then((hashBuffer) => {
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
			const hashBase64 = btoa(hashHex.slice(0, 16));
			return hashBase64;
		});
	},
	getBrowser(ua: string) {
		if (/edg/i.test(ua)) return 'Edge';
		if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return 'Chrome';
		if (/firefox|fxios/i.test(ua)) return 'Firefox';
		if (/safari/i.test(ua) && !/chrome|crios|edg/i.test(ua)) return 'Safari';
		if (/opera|opr/i.test(ua)) return 'Opera';
		if (/msie|trident/i.test(ua)) return 'Internet Explorer';
		if (/brave/i.test(ua)) return 'Brave';
		return 'Unknown';
	},
	getOS(ua: string) {
		if (/windows/i.test(ua)) return 'Windows';
		if (/android/i.test(ua)) return 'Android';
		if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
		if (/mac os x|macintosh/i.test(ua)) return 'macOS';
		if (/linux/i.test(ua)) return 'Linux';
		return 'Unknown';
	},
	getDevice(ua: string) {
		if (this.isBot(ua)) return 'bot';
		if (/ipad|tablet/i.test(ua)) return 'tablet';
		if (/mobi|iphone|android/i.test(ua)) return 'mobile';
		return 'desktop';
	},
	isBot(ua: string) {
		return /bot|spider|crawler|slurp|bingpreview|facebookexternalhit|curl|wget/i.test(ua);
	},
	getBotName(ua: string) {
		if (/googlebot/i.test(ua)) return 'Googlebot';
		if (/bingbot/i.test(ua)) return 'Bingbot';
		if (/duckduckbot/i.test(ua)) return 'DuckDuckBot';
		if (/baiduspider/i.test(ua)) return 'Baiduspider';
		if (/yandexbot/i.test(ua)) return 'YandexBot';
		return this.isBot(ua) ? 'Unknown Bot' : null;
	},
	async getAnalyticsData(ua: string, ip: string) {
		const hashedIp = await this.hashIp(ip);
		
		return {
			browser: this.getBrowser(ua),
			os: this.getOS(ua),
			device: this.getDevice(ua),
			bot: this.getBotName(ua),
			is_bot: this.isBot(ua),
			ip_hash: hashedIp
		};
	},
	async track(event: string, url: string) { 
		try {
			await fetch('/api/analytics/track', {
				method: 'POST',
				body: JSON.stringify({ event, url }),
				headers: { 'Content-Type': 'application/json' },
			})
		} catch (err) {
			console.error(err)
		}
	}
}