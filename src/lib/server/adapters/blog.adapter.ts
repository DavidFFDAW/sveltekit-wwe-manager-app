import type { BlogObject } from '../interfaces';

export const BlogAdapter = {
	required: ['title', 'slug', 'image', 'content', 'author', 'excerpt'],
	getTransformedObject(form: FormData): BlogObject {
		return {
			title: form.get('title') as string,
			slug: form.get('slug') as string,
			image: form.get('image') as string,
			content: form.get('content') as string,
			admin_id: Number(form.get('author')),
			exceptr: form.get('excerpt') as string,
			visible: form.has('visible') ? form.get('visible') === 'true' : false,
			category: form.has('category') ? (form.get('category') as string) : undefined,
			deletable: form.has('deletable') ? form.get('deletable') === 'true' : false
		};
	}
};
