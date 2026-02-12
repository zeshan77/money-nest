<?php

namespace App\Enums;

enum UserRole: string
{
    case Parent = 'parent';
    case Child = 'child';
}
