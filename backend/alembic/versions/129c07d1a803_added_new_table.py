"""Added new table

Revision ID: 129c07d1a803
Revises: 6233819b9e59
Create Date: 2024-11-27 20:54:43.280300

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '129c07d1a803'
down_revision: Union[str, None] = '6233819b9e59'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass
