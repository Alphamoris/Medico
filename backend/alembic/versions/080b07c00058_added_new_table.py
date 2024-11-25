"""added new table

Revision ID: 080b07c00058
Revises: c8bff8bc6870
Create Date: 2024-11-25 01:10:23.035583

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '080b07c00058'
down_revision: Union[str, None] = 'c8bff8bc6870'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
