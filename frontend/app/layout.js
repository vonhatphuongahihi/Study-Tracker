import './globals.css';

export const metadata = {
    title: 'Study Tracker',
    description: 'Track your study progress and vocabulary',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
