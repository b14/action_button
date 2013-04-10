<?
/**
 * @file
 *
 * Theme the action button
 *
 * Variables:
 * - button: The button link.
 * - action_message: Action message div.
 * - action_list: The div which will contain the list..
 *
 * @see template_preprocess_action_button()
 */
?>
<div id="<?php print $id; ?>" class="<?php print $classes; ?>"<?php if (isset($ref)) { print ' ref="' . $ref . '"'; } ?>>
  <?php print $button; ?>
  <?php print $action_message; ?>
  <?php print $action_arrow; ?>
  <?php print $action_list; ?>
</div>