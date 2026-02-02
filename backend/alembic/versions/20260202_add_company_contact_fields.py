"""add company phone address size

Revision ID: add_company_contact
Revises: 9e7e1103977e
Create Date: 2026-02-02

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_company_contact'
down_revision = '9e7e1103977e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('company', sa.Column('phone', sa.String(length=50), nullable=True))
    op.add_column('company', sa.Column('address', sa.String(length=500), nullable=True))
    op.add_column('company', sa.Column('size', sa.String(length=50), nullable=True))


def downgrade() -> None:
    op.drop_column('company', 'size')
    op.drop_column('company', 'address')
    op.drop_column('company', 'phone')
