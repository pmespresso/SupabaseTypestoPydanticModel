import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Supabase database.types.ts to Pydantic Models",
	description: "Convert Supabase database.types.ts to Pydantic Models",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
