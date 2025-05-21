import { teams } from "@/lib/data";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { notFound } from "next/navigation";
import { ImageUploader } from "@/components/image-uploader";

export default async function TeamPage({
  params,
}: {
  params: { teamSlug: string };
}) {
  const { teamSlug } = params;
  const team = teams.find((team) => team.slug === teamSlug);

  if (!team) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Card className="overflow-hidden max-w-3xl mx-auto mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden"
                style={{ backgroundColor: `${team.color}20` }}
              >
                <Image
                  src={team.logo || "/placeholder.svg"}
                  alt={`${team.name} logo`}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div>
                <h1
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: team.color }}
                >
                  {team.name}
                </h1>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload and Processing Section */}
        <Card className="overflow-hidden max-w-3xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Create Your Custom Image
            </h2>
            <p className="text-center text-muted-foreground mb-6 text-sm">
              Upload your image and we'll place it on our template
            </p>
            <ImageUploader placeholderImage={team.placeholderImage.src} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
