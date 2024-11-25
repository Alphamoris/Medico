"""Added new table

Revision ID: c8bff8bc6870
Revises: 5abbe22e073d
Create Date: 2024-11-23 21:20:57.803600

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c8bff8bc6870'
down_revision: Union[str, None] = '5abbe22e073d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
