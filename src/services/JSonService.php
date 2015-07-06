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
        $response = new Response(json_encode($data), 200, array('Content-type' => 'application/json;charset=UTF-8'));
        $response->headers->set('Access-Control-Allow-Origin', 'http://127.0.0.1:3030');
        return $response;
    }
}
