'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Video } from 'lucide-react';
import { generateVideo, checkVideoOperation } from '@/ai/flows/generate-video-flow';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export default function VideoPage() {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleGenerateVideo = async () => {
    setIsLoading(true);
    setError('');
    setVideoUrl('');
    setProgress(0);

    try {
      setLoadingStatus('Starting video generation...');
      let { operation } = await generateVideo({ prompt });

      if (!operation) {
        throw new Error("Failed to start video generation operation.");
      }

      setLoadingStatus('Operation in progress, please wait...');
      let checks = 0;
      const maxChecks = 24; // 2 minutes total (24 checks * 5 seconds)

      while (!operation.done && checks < maxChecks) {
        checks++;
        const currentProgress = (checks / maxChecks) * 100;
        setProgress(currentProgress);
        setLoadingStatus(`Checking status... (${checks}/${maxChecks})`);
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const checkResult = await checkVideoOperation({ operationName: operation.name });
        operation = checkResult.operation;

        if (operation?.error) {
            throw new Error(operation.error.message || 'Video generation failed.');
        }
      }
      
      setProgress(100);

      if (operation.done && operation.output?.videoUrl) {
        setVideoUrl(operation.output.videoUrl);
        toast({ title: "Video Generated!", description: "Your video is ready." });
      } else {
        throw new Error("Video generation timed out or failed to complete.");
      }

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred during video generation.');
      toast({ variant: 'destructive', title: "Generation Failed", description: e.message });
    } finally {
      setIsLoading(false);
      setLoadingStatus('');
      setProgress(0);
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">AI Video Studio</CardTitle>
          <CardDescription>
            Use the power of AI to generate video clips from a text description. Describe the scene you want to create.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            disabled={isLoading}
          />
          <Button onClick={handleGenerateVideo} disabled={isLoading || !prompt}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Video className="mr-2 h-4 w-4" />}
            {isLoading ? 'Generating...' : 'Generate Video'}
          </Button>

           {isLoading && (
            <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground">{loadingStatus}</p>
            </div>
           )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {videoUrl && !isLoading && (
            <div className="space-y-4 pt-4">
                <h3 className="font-semibold">Generated Video:</h3>
                 <video controls src={videoUrl} className="w-full rounded-md border" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
