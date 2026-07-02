import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { postService } from "./postService";
import { postRepository } from "./postRepository";

export async function handleCreatePost(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const post = await postService.create(body, session.userId);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function handleGetPosts() {
  const { posts, total } = await postRepository.findAllPublished(1, 50);
  return NextResponse.json({ posts, total });
}

export async function handleGetAdminPosts() {
  const { posts, total } = await postRepository.findAll(1, 200);
  return NextResponse.json({ posts, total });
}

export async function handleGetAllPosts() {
  const { posts, total } = await postRepository.findAll(1, 200);
  return NextResponse.json({ posts, total });
}

export async function handleGetPostBySlug(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const post = await postRepository.findBySlug(slug);

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function handleUpdatePost(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const post = await postService.update(id, body, session.userId);
    return NextResponse.json(post);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function handleDeletePost(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await postService.delete(id, session.userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function handlePublishPost(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const post = await postService.publish(id);
    return NextResponse.json(post);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish post";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
