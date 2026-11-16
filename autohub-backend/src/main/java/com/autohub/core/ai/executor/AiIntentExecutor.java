package com.autohub.core.ai.executor;

import com.autohub.core.ai.dto.AiExecutionResult;
import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;

public interface AiIntentExecutor {

    boolean supports(AiIntent intent);

    AiExecutionResult execute(AiRouteDecision decision, String originalPrompt);
}
