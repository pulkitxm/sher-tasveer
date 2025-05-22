import Link from 'next/link';

const creators = [
  { name: 'Pulkit', link: 'https://pulkitxm.com' },
  { name: 'Ayush', link: 'https://x.com/agayushh' },
  { name: 'Kanak', link: 'https://x.com/kanaktwts' },
];

export default function Footer() {
  return (
    <footer className="w-full py-6 dark:border-gray-700 border-t border-gray-200">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-sm dark:text-gray-400 text-gray-600">Created by</p>
          <div className="flex flex-wrap justify-center gap-6">
            {creators.map((creator, index) => (
              <Link
                key={index}
                href={creator.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium dark:text-gray-300 text-gray-900 hover:text-blue-600 transition-colors"
              >
                {creator.name}
              </Link>
            ))}
          </div>
          <p className="text-sm dark:text-gray-500 text-gray-500 mt-4">
            © {new Date().getFullYear()} LionHUB. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
