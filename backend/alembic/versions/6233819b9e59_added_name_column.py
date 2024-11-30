"""Added name column

Revision ID: 6233819b9e59
Revises: b8e4888b43a7
Create Date: 2024-11-27 15:16:00.427918

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6233819b9e59'
down_revision: Union[str, None] = 'b8e4888b43a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass
    