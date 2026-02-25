import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	const token = req.cookies.get('token')?.value;

	if (!token) {
		return NextResponse.redirect(new URL('/client/auth/login', req.url));
	}

	// Verificar que el token sea válido preguntándole a la API
	try {
		const res = await fetch('https://consoft-api.onrender.com/api/auth/me', {
			headers: { Cookie: `token=${token}` },
		});

		if (!res.ok) {
			return NextResponse.redirect(new URL('/client/auth/login', req.url));
		}
	} catch {
		return NextResponse.redirect(new URL('/client/auth/login', req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/admin/:path*', '/client/profile'], // ✅ sigue igual, solo protege admin
};
