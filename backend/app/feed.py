from fastapi import APIRouter
from typing import List
from app.models import Post, Author, Comment
from app.schema import PostSchema
from app.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends


router = APIRouter()

@router.get("/", response_model=List[PostSchema])
async def get_data(db: Session = Depends(get_db)):
    posts = db.query(Post).all()  
    authors = db.query(Author).all()  
    comments = db.query(Comment).all() 

    # Combine posts, authors, and comments into a single response
    result = []
    for post in posts:
        author = next((a for a in authors if a.id == post.author_id), None)
        post_comments = [comment for comment in comments if comment.post_id == post.id]  # Get comments for the post
        result.append({
            "id": post.id,
            "author": {
                "id": author.id,
                "name": author.name,
                "avatar": author.avatar,
                "role": author.role,
                "verified": author.verified
            },
            "content": post.content,
            "timestamp": post.timestamp.isoformat(),
            "likes": post.likes,
            "liked": post.liked,
            "comments": [{
                "id": comment.id,
                "author": {
                    "id": comment.author.id,
                    "name": comment.author.name,
                    "avatar": comment.author.avatar,
                    "role": comment.author.role,
                    "verified": comment.author.verified
                },
                "content": comment.content,
                "timestamp": comment.timestamp.isoformat(),
                "likes": comment.likes
            } for comment in post_comments],  # Use fetched comments
            "shares": post.shares,
            "tags": post.tags.split(','),  # Assuming tags are stored as a comma-separated string
            "read_time": post.read_time,
            "trending": post.trending,
            "image": post.image,
            "completed_time": post.completed_time.isoformat() if post.completed_time else None
        })
    return result