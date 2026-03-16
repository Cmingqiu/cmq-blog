"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarkdownContent } from "@/lib/markdown/MarkdownContent";
import { buildTocFromMarkdown } from "@/lib/markdown/toc";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ArticleToc } from "@/components/ArticleToc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SaveResult =
  | { ok: true; post: { id: string; status: string } }
  | { ok: false; error: { message: string } };

export function Editor({
  initialId,
  initialPost
}: {
  initialId?: string;
  initialPost?: {
    id: string;
    title: string;
    bodyMarkdown: string;
    status: string;
  };
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [bodyMarkdown, setBodyMarkdown] = useState(
    initialPost?.bodyMarkdown ?? ""
  );
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [status, setStatus] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | undefined>(
    initialId ?? initialPost?.id
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (initialPost) {
      setTitle(initialPost.title);
      setBodyMarkdown(initialPost.bodyMarkdown);
      setPostId(initialPost.id);
    }
  }, [initialPost]);

  const canPublish = useMemo(
    () => title.trim().length > 0 && bodyMarkdown.trim().length > 0,
    [title, bodyMarkdown]
  );
  const tocItems = useMemo(
    () => buildTocFromMarkdown(bodyMarkdown),
    [bodyMarkdown]
  );
  const headingIds = useMemo(() => tocItems.map(t => t.id), [tocItems]);

  async function save(action: "draft" | "publish") {
    setStatus(action === "draft" ? "保存中…" : "发布中…");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: postId, action, title, bodyMarkdown })
      });
      const json = (await res.json()) as SaveResult;
      if (!json.ok) {
        setStatus(json.error.message || "操作失败");
        return;
      }
      setPostId(json.post.id);
      setDirty(false);
      if (action === "publish") {
        setStatus("发布成功，正在跳转…");
        // Give a small delay to show success state
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } else {
        setStatus("草稿已保存");
      }
    } catch {
      setStatus("网络请求失败");
    }
  }

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  return (
    <main
      id='main-content'
      className='container mx-auto px-4 max-w-7xl space-y-6 py-10'>
      <div className='flex items-center gap-4'>
        <Link
          href='/'
          className='inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-muted transition-colors'
          title='返回首页'>
          <ArrowLeft className='w-5 h-5' />
        </Link>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight'>发布文章</h1>
        </div>
      </div>

      <Card className='border-none shadow-none bg-transparent'>
        <CardHeader className='flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 p-0 mb-6'>
          <div className='min-w-0 flex-1'>
            <Input
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setDirty(true);
              }}
              name='title'
              autoComplete='off'
              aria-label='文章标题'
              placeholder='文章标题…'
              className='text-2xl font-bold h-auto border-none shadow-none focus-visible:ring-0 p-0 placeholder:text-muted-foreground/50 bg-transparent'
            />
          </div>
          <div className='flex shrink-0 items-center gap-2'>
            <Button
              type='button'
              variant='ghost'
              className='text-muted-foreground'
              onClick={() => save("draft")}>
              保存草稿
            </Button>
            <Button
              type='button'
              className='bg-brand hover:bg-brand/90 text-brand-foreground px-6'
              onClick={() => save("publish")}
              disabled={!canPublish}>
              发布
            </Button>
          </div>
        </CardHeader>

        {status && (
          <div
            className='mb-4 text-sm text-brand font-medium animate-in fade-in slide-in-from-top-1'
            aria-live='polite'>
            {status}
          </div>
        )}

        <CardContent className='p-0'>
          <div className='flex flex-col gap-8 lg:flex-row'>
            <div className='min-w-0 flex-1'>
              <CardTitle className='sr-only'>编辑</CardTitle>
              {/* Mobile tabs for edit/preview */}
              <div className='lg:hidden flex gap-2 mb-4'>
                <Button
                  type='button'
                  variant={mode === "edit" ? "secondary" : "ghost"}
                  size='sm'
                  onClick={() => setMode("edit")}>
                  编辑
                </Button>
                <Button
                  type='button'
                  variant={mode === "preview" ? "secondary" : "ghost"}
                  size='sm'
                  onClick={() => setMode("preview")}>
                  预览
                </Button>
              </div>

              <div
                className={cn(
                  "rounded-lg border bg-card overflow-hidden",
                  mode === "preview" ? "hidden lg:block" : "block"
                )}>
                <MarkdownEditor
                  value={bodyMarkdown}
                  onChange={v => {
                    setBodyMarkdown(v);
                    setDirty(true);
                  }}
                  height={600}
                />
              </div>
            </div>

            <div
              className={cn(
                "flex-1 min-w-0 lg:max-w-[50%]",
                mode === "edit" ? "hidden lg:block" : "block"
              )}>
              <div className='rounded-lg border bg-card p-8 min-h-[600px] overflow-auto prose prose-neutral dark:prose-invert max-w-none'>
                <div className='mb-8 border-b pb-4'>
                  <h1 className='text-4xl font-extrabold mb-2'>
                    {title || "标题预览"}
                  </h1>
                  <p className='text-sm text-muted-foreground'>预览模式</p>
                </div>
                <MarkdownContent
                  markdown={bodyMarkdown}
                  headingIds={headingIds}
                />
              </div>
            </div>

            {tocItems.length > 0 && mode === "preview" && (
              <div className='hidden xl:block w-48 shrink-0'>
                <div className='sticky top-24'>
                  <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4'>
                    文章目录
                  </p>
                  <ArticleToc items={tocItems} className='text-sm' />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
