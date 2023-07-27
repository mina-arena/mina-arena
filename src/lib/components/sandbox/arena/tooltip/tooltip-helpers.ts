import * as Utils from '../../play/utils';

export const onAfterUpdate = (
  playerPublicKeys: Array<string>,
  playerColors: Array<string>,
  hoveredPiece?: GamePiece,
  selectedPiece?: GamePiece,
  tooltipAbsolutePosition?: Point,
) => {
  if (hoveredPiece) {
    showHoveredPieceTooltip(
      playerPublicKeys,
      playerColors,
      hoveredPiece,
      selectedPiece,
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
  selectedPiece?: GamePiece,
  tooltipAbsolutePosition?: Point,
) => {
  var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
  if (!tooltip || !hoveredPiece || !tooltipAbsolutePosition) return;

  const playerMinaPublicKey = hoveredPiece.gamePlayer.player.minaPublicKey;
  const playerColor = Utils.playerColor(playerPublicKeys, playerMinaPublicKey, playerColors);

  // If the mouse is near the bottom of the canvas,
  // draw the tooltip above the mouse instead of below it
  let yOffset = 0;
  if (tooltipAbsolutePosition.y < 400) {
    yOffset = 0;
  } else {
    if (selectedPiece) {
      yOffset = -260;
    } else {
      yOffset = -230;
    }
  }
  tooltip.style.top = (tooltipAbsolutePosition.y + 20 + yOffset) + 'px';
  tooltip.style.left = (tooltipAbsolutePosition.x + 20) + 'px';

  tooltip.style.display = 'block';
  tooltip.style.borderColor = playerColor;
  tooltip.style.borderWidth = '4px';
}

export const hideHoveredPieceTooltip = () => {
  var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
  if (!tooltip) return;

  tooltip.style.display = 'none';
}