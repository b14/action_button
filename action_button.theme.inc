<?php


// @todo PBJ
//   Ryder op i filen, og gør group klar (hvis nødvendigt her).

/**
 * @file
 * The theming related functions of the action_button module
 */
 

/**
 * Get a checkbox, to use for a grouped action button.
 *
 * @param $variables
 *   An associative array containing:
 *   - "group": The group the checkbox belongs to.
 */
function theme_action_button_checkbox($variables) {
  $id_name = drupal_html_class($variables['group']);
  return '<input type="checkbox" name="' . $variables['group'] . '" value="' . $variables['id'] . '" />';
}

/**
 * Process variables for the action_button theme function.
 *
 * This adds classes and other needed information.
 *
 * @param $variables
 *   An associative array containing:
 *   - "context": The button context.
 *
 * @see action-button-tpl.php
 */
function template_preprocess_action_button(&$variables) {
  $context = $variables['context'];
  
  // @todo PBJ
  //   Gør så vi ikke får alle keys og values med, men kun et udpluk af de vigtige.
  
  // Setup the class
  foreach ($context as $key => $value) {
    if (is_string($value)) {
      $variables['classes_array'][] = drupal_html_class('action-button-' . $key . '-' . $value);
    }
  }
  
  if (isset($variables['reverse']) && $variables['reverse'] === TRUE) {
    $variables['classes_array'][] = 'reverse';
  }
  
  // Create a unique ID.
  $variables['id'] = drupal_html_id('action-button-' . $_GET['q']);
  // We need to cater for infinite scroll, not making proper drupal ajax calls
  // so if we see a page _GET argument we prepend it.
  if (isset($_GET['page']) && is_numeric($_GET['page'])) {
    $variables['id'] .= '-' . $_GET['page'];
  }
  
  $query = $context;  
  $query['html_id'] = $variables['id'];
  
  // If the action button is a group button.
  if (isset($context['group']) && !empty($context['group'])) {
    $variables['classes_array'][] = 'group-button';
    $query['group'] = $context['group'];
  }
  
  // Create the button (link), and the action list element.
  // Because both the button and action list element is recognized by it's class
  // ajax time it's important these are kept intact.
  $variables['button'] = l(
    '', 
    'action_button/fetch_list/nojs', //'action_button/fetch',
    array(
      'attributes' => array(
        'id' => drupal_html_id('action-button-' . $context['type'] . '-' . $context['id']),
        'class' => array('toggler', 'toggler-image', 'use-ajax'),
      ),
      'query' => $query,
      'html' => TRUE
    )
  );
  $variables['action_message'] = '<span class="action-message">' . l(
     $variables['title'], 
    '',
    array(
      'attributes' => array(
        // 'id' => $button_id,
        'class' => array('toggler-text'),
      ),
      'html' => TRUE,
      'fragment' => 'imjustaholderhere',
      'external' => TRUE
    )
  ) . '</span>';
  
  $variables['action_message'] = '<div class="action-button-title">' . l(
     $variables['title'], 
    '',
    array(
      'attributes' => array(
        // 'id' => $button_id,
        'class' => array('toggler-text'),
      ),
      'html' => TRUE,
      'fragment' => 'imjustaholderhere',
      'external' => TRUE
    )
  ) . '</div>';
  
  $variables['action_list'] = '';
  
  $variables['action_arrow'] = '<div class="action-container"><div class="action-arrow"></div><div class="action-content"><div class="action-list"></div><div class="action-message"></div></div></div>';
}