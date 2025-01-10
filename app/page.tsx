import FileUploader from "../components/FileUploader";
import { AboutModal } from "../components/AboutModal";
import Link from "next/link";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-gray-100 py-4">
				<div className="container mx-auto px-4 flex justify-end">
					<AboutModal />
				</div>
			</header>
			<main className="flex-grow flex flex-col items-center justify-center p-8">
				<div className="w-full max-w-3xl">
					<h1 className="text-4xl font-bold mb-8 text-center">
						Convert Supabase{" "}
						<code className="bg-gray-100 p-1 rounded">database.types.ts</code>{" "}
						into Pydantic Models
					</h1>
					<p>Upload your database.types.ts below.</p>

					<div className="mt-8">
						<FileUploader />
					</div>
				</div>
			</main>
			<footer className="bg-gray-100 py-4">
				<div className="container mx-auto px-4 flex justify-center items-center">
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-600">Built with v0</span>
						<span className="text-sm text-gray-600">
							by <Link href="https://x.com/0xyjkim">0xyjkim</Link>
						</span>
					</div>
				</div>
			</footer>
		</div>
	);
}
