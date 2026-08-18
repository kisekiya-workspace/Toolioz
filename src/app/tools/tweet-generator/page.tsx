"use client";

import { useState, useRef } from "react";
import { ToolHeader } from "@/components/sociials-tools/ToolHeader";
import { Card, CardContent } from "@/components/sociials-ui/card";
import { Button } from "@/components/sociials-ui/button";
import { Input } from "@/components/sociials-ui/input";
import { Label } from "@/components/sociials-ui/label";
import { Textarea } from "@/components/sociials-ui/textarea";
import { Download, Upload, Heart, MessageCircle, Repeat, Share, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

export default function TweetGeneratorPage() {
    const [name, setName] = useState("Tools Toolioz");
    const [username, setUsername] = useState("toolssociials");
    const [content, setContent] = useState("This is a fake tweet generated amazingly! 🚀\n\n#tools #developer #social");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [date, setDate] = useState("10:00 AM · Jan 1, 2024");
    const [views, setViews] = useState("1.2M");
    const [likes, setLikes] = useState("12K");
    const [retweets, setRetweets] = useState("524");
    const [isVerified, setIsVerified] = useState(true);

    const tweetRef = useRef<HTMLDivElement>(null);

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    };

    const downloadTweet = async () => {
        if (tweetRef.current) {
            try {
                const canvas = await html2canvas(tweetRef.current, {
                    backgroundColor: "#ffffff", // Default to white, change if dark mode support needed
                    scale: 2
                });
                const link = document.createElement("a");
                link.download = "tweet-mockup.png";
                link.href = canvas.toDataURL();
                link.click();
                toast.success("Tweet downloaded!");
            } catch (err) {
                toast.error("Failed to generate image.");
            }
        }
    };

    return (
        <div className="container px-6 py-12 m-auto max-w-6xl">
            <ToolHeader
                title="Tweet Generator"
                description="Create realistic fake tweet screenshots for memes and presentations."
            />

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
                {/* Controls */}
                <div className="space-y-6">
                    <Card className="border-0 shadow-lg ring-1 ring-border/50">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base font-semibold">User Info</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Display Name</Label>
                                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Username (@)</Label>
                                        <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="space-y-2 flex-1">
                                        <Label className="text-xs">Profile Picture</Label>
                                        <div className="flex gap-2">
                                            <Button variant="outline" className="w-full" onClick={() => document.getElementById('avatarInput')?.click()}>
                                                <Upload className="w-4 h-4 mr-2" /> Upload
                                            </Button>
                                            <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Verified Badge</Label>
                                        <div className="h-10 flex items-center">
                                            <input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} className="h-5 w-5 accent-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-base font-semibold">Tweet Content</Label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-base font-semibold">Metadata</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs">Date & Time</Label>
                                        <Input value={date} onChange={(e) => setDate(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Views</Label>
                                        <Input value={views} onChange={(e) => setViews(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Likes</Label>
                                        <Input value={likes} onChange={(e) => setLikes(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs">Retweets</Label>
                                        <Input value={retweets} onChange={(e) => setRetweets(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full font-bold h-12" onClick={downloadTweet}>
                                <Download className="mr-2" /> Download Tweet
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="flex items-center justify-center pt-8 lg:pt-0">
                    <div ref={tweetRef} className="w-full max-w-[600px] bg-black text-white rounded-xl border border-gray-800 shadow-xl overflow-hidden p-6 font-sans">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
                                    {avatar ? (
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white font-bold text-xl">
                                            {name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="leading-tight">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-[15px]">{name}</span>
                                        {isVerified && <BadgeCheck className="w-[18px] h-[18px] text-[#1D9BF0] fill-current" />}
                                    </div>
                                    <div className="text-[15px] text-gray-500">@{username}</div>
                                </div>
                            </div>
                            <div className="text-gray-500">
                                <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-[17px] leading-6 whitespace-pre-wrap mb-4 font-normal">
                            {content}
                        </div>

                        {/* Date & Views */}
                        <div className="text-[15px] text-gray-500 border-b border-gray-800 pb-4 mb-4 flex items-center gap-1">
                            <span>{date}</span>
                            <span>·</span>
                            <span className="text-white font-bold">{views}</span>
                            <span>Views</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-gray-500 px-2">
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1D9BF0] transition-colors">
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-sm">542</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#00BA7C] transition-colors">
                                <Repeat className="w-5 h-5" />
                                <span className="text-sm">{retweets}</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#F91880] transition-colors">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm">{likes}</span>
                            </div>
                            <div className="flex items-center gap-2 group cursor-pointer hover:text-[#1D9BF0] transition-colors">
                                <Share className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
