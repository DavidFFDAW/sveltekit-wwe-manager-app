export const COOKIE_NAME = 'wwe-manager-session';
export type Brands = 'raw' | 'smackdown' | 'awl';
type BrandConstant = {
	title: string;
	name: Brands;
	image: string;
};
export const brands: Record<string, BrandConstant> = {
	raw: {
		title: 'Raw',
		name: 'raw',
		image: '/brands/raw.webp'
	},
	smackdown: {
		title: 'Smackdown',
		name: 'smackdown',
		image: '/brands/smackdown.webp'
	},
	awl: {
		title: 'AWL',
		name: 'awl',
		image: '/brands/awl.webp'
	}
};
