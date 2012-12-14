<?php

// @todo
//   Jeg forstår ikke CTools plugins systemet. Hvordan før jeg det muligt at tilføje action_button
//   i panes på andre content types end ting_object? Og samtidig få de rigtige informationer med?
//
// Changed the markup at bit - AFK

$plugin = array(
  'title' => t('Action button'),
  'description' => t('Action button'),
  'single' => TRUE,
  /*'content_types' => array('ting_object'),*/
  'render callback' => 'action_button_content_type_render',
  'required context' => new ctools_context_required(t('Ting object'), 'ting_object'),
  'category' => t('Ting'),
);

function action_button_content_type_render($subtype, $conf, $args, $context) {
  $block = new stdClass();
  $object = isset($context->data) ? ($context->data) : NULL;
  if ($object instanceOf TingEntity) {
    $block->content = array(
      '#theme' => 'action_button',
      '#context' => array(
        'type' => 'TingEntity',
        'id' => $object->ding_entity_id        
      ),
      '#prefix' => '<div class="actions"><div class="inner">',
      '#suffix' => '</div></div>'
    );
    /*
    theme('action_button', array(
      'context' => array(
        'type' => 'TingEntity',
        'id' => $object->ding_entity_id
      )
    ));
    */
  }

  return $block;
}
