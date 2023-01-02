"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema = { "$schema": "http://json-schema.org/draft-07/schema#", "definitions": { "UserPostRequest": { "type": "object",
            "properties": {
                "num_item": { "type": "number" },
                "nome_item": { "type": "string" }
            }, "required": ["num_item", "nome_item"] } } };
exports.default = schema.definitions;
