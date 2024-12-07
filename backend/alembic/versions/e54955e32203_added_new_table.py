"""Added new table

Revision ID: e54955e32203
Revises: 890220906668
Create Date: 2024-11-27 21:41:41.387004

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e54955e32203'
down_revision: Union[str, None] = '890220906668'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('authors',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('avatar', sa.String(), nullable=True),
    sa.Column('role', sa.String(), nullable=False),
    sa.Column('verified', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('doctors',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('speciality', sa.String(), nullable=False),
    sa.Column('rating', sa.Float(), nullable=False),
    sa.Column('reviews', sa.Integer(), nullable=False),
    sa.Column('experience', sa.String(), nullable=False),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('next_available', sa.String(), nullable=False),
    sa.Column('location', sa.String(), nullable=False),
    sa.Column('patients', sa.String(), nullable=False),
    sa.Column('education', sa.String(), nullable=False),
    sa.Column('languages', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('consultation_fee', sa.Float(), nullable=False),
    sa.Column('availability', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('verified', sa.Boolean(), nullable=True),
    sa.Column('awards', sa.Integer(), nullable=False),
    sa.Column('bio', sa.Text(), nullable=True),
    sa.Column('time_slots', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('specializations', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('insurance_accepted', sa.ARRAY(sa.String()), nullable=False),
    sa.Column('hospital_affiliations', sa.ARRAY(sa.String()), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('medicines',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('price', sa.Float(), nullable=True),
    sa.Column('category', sa.String(), nullable=True),
    sa.Column('stock', sa.Integer(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('dosage', sa.String(), nullable=True),
    sa.Column('requires_prescription', sa.Boolean(), nullable=True),
    sa.Column('rating', sa.Float(), nullable=True),
    sa.Column('reviews', sa.Integer(), nullable=True),
    sa.Column('discount', sa.Integer(), nullable=True),
    sa.Column('expiry', sa.String(), nullable=True),
    sa.Column('manufacturer', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_medicines_id'), 'medicines', ['id'], unique=False)
    op.create_index(op.f('ix_medicines_name'), 'medicines', ['name'], unique=False)
    op.create_table('rooms',
    sa.Column('join_code', sa.Integer(), nullable=False, comment='This is a 6 digit unique join code'),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('last_activity', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('join_code')
    )
    op.create_table('users',
    sa.Column('u_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('firstname', sa.String(), nullable=False),
    sa.Column('lastname', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('u_id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_firstname'), 'users', ['firstname'], unique=False)
    op.create_index(op.f('ix_users_lastname'), 'users', ['lastname'], unique=False)
    op.create_index(op.f('ix_users_password'), 'users', ['password'], unique=True)
    op.create_table('participants',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('join_code', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['join_code'], ['rooms.join_code'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('posts',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('author_id', sa.String(), nullable=False),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('likes', sa.Integer(), nullable=True),
    sa.Column('liked', sa.Boolean(), nullable=True),
    sa.Column('shares', sa.Integer(), nullable=True),
    sa.Column('tags', sa.String(), nullable=True),
    sa.Column('read_time', sa.String(), nullable=True),
    sa.Column('trending', sa.Boolean(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('completed_time', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['author_id'], ['authors.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('webrtc_offers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('join_code', sa.Integer(), nullable=True),
    sa.Column('offer_id', sa.String(), nullable=True),
    sa.Column('offer_details', sa.JSON(), nullable=True),
    sa.Column('expires_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['join_code'], ['rooms.join_code'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('comments',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('author_id', sa.String(), nullable=False),
    sa.Column('content', sa.String(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('likes', sa.Integer(), nullable=True),
    sa.Column('post_id', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['author_id'], ['authors.id'], ),
    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('comments')
    op.drop_table('webrtc_offers')
    op.drop_table('posts')
    op.drop_table('participants')
    op.drop_index(op.f('ix_users_password'), table_name='users')
    op.drop_index(op.f('ix_users_lastname'), table_name='users')
    op.drop_index(op.f('ix_users_firstname'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
    op.drop_table('rooms')
    op.drop_index(op.f('ix_medicines_name'), table_name='medicines')
    op.drop_index(op.f('ix_medicines_id'), table_name='medicines')
    op.drop_table('medicines')
    op.drop_table('doctors')
    op.drop_table('authors')
    # ### end Alembic commands ###
