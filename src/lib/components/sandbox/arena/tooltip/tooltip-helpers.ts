import * as Utils from '../../play/utils';

export const onAfterUpdate = (
  playerPublicKeys: Array<string>,
  playerColors: Array<string>,
  hoveredPiece?: GamePiece,
  tooltipAbsolutePosition?: Point,
) => {
  if (hoveredPiece) {
    showHoveredPieceTooltip(
      playerPublicKeys,
      playerColors,
      hoveredPiece,
      tooltipAbsolutePosition,
    );
  } else {
    hideHoveredPieceTooltip();
  }
};

export const showHoveredPieceTooltip = (
  playerPublicKeys: Array<string>,
  playerColors: Array<string>,
  hoveredPiece?: GamePiece,
  tooltipAbsolutePosition?: Point,
) => {
  var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
  if (!tooltip || !hoveredPiece || !tooltipAbsolutePosition) return;

  const playerMinaPublicKey = hoveredPiece.gamePlayer.player.minaPublicKey;
  const playerColor = Utils.playerColor(playerPublicKeys, playerMinaPublicKey, playerColors);

  tooltip.style.left = (tooltipAbsolutePosition.x + 20) + 'px';
  tooltip.style.top = (tooltipAbsolutePosition.y + 20) + 'px';
  tooltip.style.display = 'block';
  tooltip.style.backgroundColor = playerColor;
}

export const hideHoveredPieceTooltip = () => {
  var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
  if (!tooltip) return;

  tooltip.style.display = 'none';
}