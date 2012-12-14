<?php

/**
 * @file
 * The API documentation for the action_button module.
 */

/**
 * This hook allows programmers to enter multible currencies in the format
 * 
 * @param $context
 *   The context of the action button.
 *
 * @return
 *   Return an array with a list of render arrays. In an attempt to make ajax
 *   calls easier in a link #theme, you can simply supply it with a #callback
 *   property instead of a #path. This will automatically use a custom made
 *   ajax handling, which leaves a smaller footprint than the normal ajax API.
 */
function hook_action_button_list($context) {
  return array(
    'name' => array(
      '#theme' => 'link',
      '#text' => t('menu title: @something', array('@something' => 'some input')),
      '#callback' => 'function_name_of_callback_function'
    ),
    'key' => array(
      '#theme' => 'link',
      '#text' => t('menu title'),
      '#path' => 'uses/link/instead/of/callback'
      '#weight' => 2
    ),
    'middle' => array(
      '#theme' => 'link',
      '#text' => t('middle menu (we use weight)'),
      '#weight' => 1,
      '#callback' => 'callback_action_button_list'
    )
  );
}