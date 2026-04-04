"""add policies and premium logs
Revision ID: 39c13404ebdc
Revises: a776d530125b
Create Date: 2026-04-04 15:57:34.674059
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSON

revision: str = '39c13404ebdc'
down_revision: Union[str, None] = 'a776d530125b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table('policies',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('worker_id', UUID(as_uuid=True), nullable=False),
        sa.Column('plan', sa.String(), nullable=False),
        sa.Column('zone', sa.String(), nullable=False),
        sa.Column('shift', sa.String(), nullable=False),
        sa.Column('weekly_premium', sa.Float(), nullable=False),
        sa.Column('protected_hours', sa.Integer(), nullable=False),
        sa.Column('max_payout', sa.Float(), nullable=False),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=True),
        sa.Column('end_date', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['worker_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_table('premium_logs',
        sa.Column('id', UUID(as_uuid=True), nullable=False),
        sa.Column('policy_id', UUID(as_uuid=True), nullable=True),
        sa.Column('worker_id', UUID(as_uuid=True), nullable=False),
        sa.Column('zone', sa.String(), nullable=True),
        sa.Column('shift', sa.String(), nullable=True),
        sa.Column('base_premium', sa.Float(), nullable=True),
        sa.Column('zone_risk_load', sa.Float(), nullable=True),
        sa.Column('shift_risk_load', sa.Float(), nullable=True),
        sa.Column('coverage_multiplier', sa.Float(), nullable=True),
        sa.Column('safe_profile_discount', sa.Float(), nullable=True),
        sa.Column('final_premium', sa.Float(), nullable=True),
        sa.Column('plan', sa.String(), nullable=True),
        sa.Column('breakdown', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['policy_id'], ['policies.id']),
        sa.ForeignKeyConstraint(['worker_id'], ['users.id']),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('premium_logs')
    op.drop_table('policies')