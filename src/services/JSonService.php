<?php

namespace services;

use Symfony\Component\HttpFoundation\Response;

/**
 * Description of JSonService
 *
 * @author dst17
 */
class JSonService {
    public function constructJsonResponse($data) {
        return new Response(json_encode($data), 200, array('Content-type' => 'application/json'));
    }
}
?>
